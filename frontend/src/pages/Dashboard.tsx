import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      const res = await axios.get("http://localhost:5000/api/users", {
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
    console.log("this is a dash id", userId);
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome to Dashboard</h2>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user by name..."
          className="w-full px-4 py-2 mb-6 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {search.trim() !== "" && (
          <ul className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <li
                  key={user._id}
                  onClick={() => openChat(user._id)}
                  className="cursor-pointer bg-gray-800 hover:bg-gray-700 transition-all p-4 rounded-lg shadow-md"
                >
                  <div className="font-semibold text-lg">{user.name}</div>
                  <div className="text-sm text-gray-400">{user.email}</div>
                </li>
              ))
            ) : (
              <li className="text-gray-400 text-center">No user found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
