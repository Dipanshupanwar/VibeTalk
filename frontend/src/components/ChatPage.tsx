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

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUserId(res.data.user._id);
    };
    fetchUser();
  }, [token]);

  if (!currentUserId || !userId) return <p>Loading...</p>;

  return (
    <div className="flex h-screen">
      {/* 🟢 Sidebar with its own scroll */}
      <div className="w-[300px] bg-gray-900 overflow-y-auto custom-scrollbar">
        <ChatListSidebar currentUserId={currentUserId} />
      </div>

      {/* 🟦 Chat area with ChatBox */}
      <div className="flex-1 flex flex-col h-full">
        <ChatProvider userId={userId}>
          <ChatBox />
        </ChatProvider>
      </div>
    </div>
  );
}

export default ChatPage;
