import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface User {
  _id: string;
  name: string;
  email: string;
}

function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  const getUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    if (search.trim() !== "") {
      getUsers();
    }
  }, [search]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const openChat = (userId: string) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="min-h-screen w-full bg-gray-800 text-gray-800 px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* 💬 Animated Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <h2 className="text-4xl font-bold text-blue-600">
            Welcome back, Chat Explorer!
          </h2>
          <p className="text-gray-600 text-lg">
            Start a conversation. Connect. Collaborate.{" "}
            <span className="animate-pulse">🚀</span>
          </p>
        </motion.div>

        {/* 🔍 Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </motion.div>

        {/* 🧑 User Cards */}
        {search.trim() !== "" && (
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <motion.li
                  key={user._id}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.03 }}
                  className="cursor-pointer bg-white border border-gray-200 hover:shadow-lg transition p-5 rounded-xl"
                  onClick={() => openChat(user._id)}
                >
                  <div className="text-lg font-semibold text-blue-700">
                    {user.name}
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </motion.li>
              ))
            ) : (
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-400 col-span-2"
              >
                No users found
              </motion.li>
            )}
          </motion.ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
