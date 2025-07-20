import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "./AuthContext";
import { collection, addDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, writeBatch } from "firebase/firestore";
import { generateChatId } from "../utils/chatId";
import { uploadToCloudinary } from "../utils/uploadToCloudinary"; // ✅ Cloudinary uploader


// interface Message {
//   id?: string;
//   senderId: string;
//   text: string;
//   timestamp: any;
//   seenBy?: string[];
//   imageUrl?: string;
// }

interface Message {
  id?: string;
  senderId: string;
  text: string;
  timestamp: any;
  seenBy?: string[];
  mediaUrl?: string;
  mediaType?: "image" | "video";
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface ImageData {
  url: string;
  caption: string;
}

interface ChatContextType {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  messages: Message[];
  receiver: User | null;
  selectedImages: string[];
  setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>;
  sendMessage: () => void;
  handleSendImages: (images: ImageData[]) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showImagePreview: boolean;
  setShowImagePreview: React.Dispatch<React.SetStateAction<boolean>>;
  currentUserId: string;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({
  children,
  userId,
}: {
  children: ReactNode;
  userId: string;
}) => {
  const { token } = useAuth();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [receiver, setReceiver] = useState<User | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [showImagePreview, setShowImagePreview] = useState(false);

  // Fetch users
 useEffect(() => {
  const fetchData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const me = await axios.get(`${apiUrl}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUserId(me.data.user._id);

      const res = await axios.get(`${apiUrl}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReceiver(res.data.user);
    } catch (err) {
      console.error("Error fetching user data", err);
    }
  };

  if (token && userId) fetchData();
}, [token, userId]);


  // Listen to messages
  useEffect(() => {
    if (!currentUserId || !userId) return;

    const chatId = generateChatId(currentUserId, userId);
    const msgRef = collection(db, "chats", chatId, "messages");
    const q = query(msgRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Message),
      }));
      setMessages(msgs);

      // Auto mark seen
      const unseen = snapshot.docs.filter((d) => {
        const data = d.data();
        return (
          data.senderId !== currentUserId &&
          (!data.seenBy || !data.seenBy.includes(currentUserId))
        );
      });

      if (unseen.length) {
        const batch = writeBatch(db);
        unseen.forEach((docSnap) => {
          const ref = doc(db, "chats", chatId, "messages", docSnap.id);
          const seen = docSnap.data().seenBy || [];
          batch.update(ref, { seenBy: [...seen, currentUserId] });
        });
        await batch.commit();
      }
    });

    return () => unsubscribe();
  }, [currentUserId, userId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const chatId = generateChatId(currentUserId, userId);
    const msgRef = collection(db, "chats", chatId, "messages");

    await addDoc(msgRef, {
      senderId: currentUserId,
      text,
      timestamp: serverTimestamp(),
      seenBy: [currentUserId],
    });

    await updateChatList(text);
    setText("");
  };

  const updateChatList = async (msg: string) => {
    const ref1 = doc(db, "users", currentUserId, "chatList", userId);
    const ref2 = doc(db, "users", userId, "chatList", currentUserId);

    await setDoc(ref1, {
      userId: userId,
      lastMessage: msg,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    await setDoc(ref2, {
      userId: currentUserId,
      lastMessage: msg,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const previews: string[] = [];
    let loaded = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        loaded++;
        if (loaded === files.length) {
          setSelectedImages(previews.slice(0, 5));
          setShowImagePreview(true); // ✅ show preview modal
        }
      };
      reader.readAsDataURL(file);
    });
  };

// const handleSendImages = async (images: ImageData[]) => {
//   const chatId = generateChatId(currentUserId, userId);
//   const msgRef = collection(db, "chats", chatId, "messages");
//   const batch = writeBatch(db);

//   for (let i = 0; i < images.length; i++) {
//     const { url, caption } = images[i];

//     try {
//       const cloudUrl = await uploadToCloudinary(url);
//       if (!cloudUrl) continue; // ✅ Skip if upload failed

//       const ref = doc(msgRef);
//       batch.set(ref, {
//         senderId: currentUserId,
//         imageUrl: cloudUrl,
//         text: caption,
//         timestamp: serverTimestamp(),
//         seenBy: [currentUserId],
//       });

//       await updateChatList(caption || "📷 Image");
//     } catch (error) {
//       console.error("Image upload failed, skipping...");
//     }
//   }

//   await batch.commit();
//   setSelectedImages([]);
// };
const handleSendImages = async (images: ImageData[]) => {
  const chatId = generateChatId(currentUserId, userId);
  const msgRef = collection(db, "chats", chatId, "messages");
  const batch = writeBatch(db);

  for (let i = 0; i < images.length; i++) {
    const { url, caption } = images[i];

    try {
      const result = await uploadToCloudinary(url); // returns { url, type }
      if (!result.url) continue;

      const ref = doc(msgRef);
      batch.set(ref, {
        senderId: currentUserId,
        mediaUrl: result.url,
        mediaType: result.type, // "image" or "video"
        text: caption,
        timestamp: serverTimestamp(),
        seenBy: [currentUserId],
      });

      await updateChatList(caption || (result.type === "video" ? "📹 Video" : "📷 Image"));
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }

  await batch.commit();
  setSelectedImages([]);
};


  return (
    <ChatContext.Provider
      value={{
        text,
        setText,
        messages,
        receiver,
        selectedImages,
        setSelectedImages,
        sendMessage,
        handleSendImages,
        handleImageUpload,
        showImagePreview,
        setShowImagePreview,
        currentUserId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
