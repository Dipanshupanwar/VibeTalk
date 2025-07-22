// ChatPage.tsx
import { useEffect, useState } from "react";
import ChatBox from "../pages/ChatBox";
import ChatListSidebar from "./ChatListSidebar";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ChatProvider } from "../context/chatContext";

function ChatPage() {
  const { token } = useAuth();
  const [currentUserId, setCurrentUserId] = useState("");
  const { userId } = useParams();
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch logged in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(res.data.user._id);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };
    fetchUser();
  }, [token]);

  if (!currentUserId) return <p className="text-white p-4">Loading...</p>;

  // Mobile layout
  if (isMobile) {
    return (
      <div className="h-screen w-full flex flex-col overflow-hidden bg-gray-900 text-white">
        {userId ? (
          <ChatProvider userId={userId}>
            <ChatBox />
          </ChatProvider>
        ) : (
          <ChatListSidebar currentUserId={currentUserId} />
        )}
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex h-screen w-full bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-[300px] border-r border-gray-700 overflow-y-auto custom-scrollbar">
        <ChatListSidebar currentUserId={currentUserId} />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex items-center justify-center relative">
        {userId ? (
          <ChatProvider userId={userId}>
            <ChatBox />
          </ChatProvider>
        ) : (
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-blue-400">Welcome to ByteChat 💬</h2>
            <p className="text-gray-400">Select a user from the sidebar to start chatting.</p>
            <p className="text-sm text-gray-500">Your conversations appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
