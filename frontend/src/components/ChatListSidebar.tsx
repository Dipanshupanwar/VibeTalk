import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { generateChatId } from "../utils/chatId";

interface ChatMeta {
  userId: string;
  lastMessage: string;
  updatedAt: any;
  name?: string;
  unseenCount?: number;
}

export default function ChatListSidebar({ currentUserId }: { currentUserId: string }) {
  const [chatList, setChatList] = useState<ChatMeta[]>([]);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (!currentUserId || !token) return;

    const chatListRef = collection(db, "users", currentUserId, "chatList");
    const q = query(chatListRef, orderBy("updatedAt", "desc"));

    const msgUnsubMap: { [chatId: string]: () => void } = {};

    const unsubChatList = onSnapshot(q, async (snapshot) => {
      const rawList: ChatMeta[] = snapshot.docs.map((doc) => doc.data() as ChatMeta);

      const updatedList = await Promise.all(
        rawList.map(async (chat) => {
          try {
            const userRes = await axios.get(`http://localhost:5000/api/users/${chat.userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            const chatId = generateChatId(currentUserId, chat.userId);
            const msgRef = collection(db, "chats", chatId, "messages");
            const msgQuery = query(msgRef, orderBy("timestamp", "desc"));

            if (msgUnsubMap[chatId]) {
              msgUnsubMap[chatId]();
            }

            msgUnsubMap[chatId] = onSnapshot(msgQuery, (msgSnap) => {
              const unseenCount = msgSnap.docs.filter(
                (doc) => !doc.data().seenBy?.includes(currentUserId)
              ).length;

              setChatList((prevList) =>
                prevList.map((c) =>
                  c.userId === chat.userId ? { ...c, unseenCount } : c
                )
              );
            });

            return {
              ...chat,
              name: userRes.data.user.name,
              unseenCount: 0,
            };
          } catch (err) {
            return { ...chat, name: "Unknown", unseenCount: 0 };
          }
        })
      );

      setChatList(updatedList);
    });

    return () => {
      unsubChatList();
      Object.values(msgUnsubMap).forEach((unsub) => unsub());
    };
  }, [currentUserId, token]);

  return (
    <div className="w-full h-full overflow-y-auto p-4 bg-gray-800 text-white border-r border-gray-700 custom-scrollbar">
      <h2 className="text-lg font-bold mb-4">Recent Chats</h2>
      <ul className="space-y-2">
        {chatList.map((chat) => (
          <li
            key={chat.userId}
            onClick={() => navigate(`/chat/${chat.userId}`)}
            className="p-3 hover:bg-gray-700 rounded cursor-pointer transition"
          >
            <div className="flex justify-between items-center font-semibold">
              <span>{chat.name}</span>
              {chat.unseenCount! > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {chat.unseenCount}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
