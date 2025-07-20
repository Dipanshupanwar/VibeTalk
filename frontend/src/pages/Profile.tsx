import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function Profile() {
  const { token, setToken } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        navigate("/login");
      }
    };

    if (token) {
      fetchProfile();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center px-4">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>

        {user ? (
          <div className="space-y-4">
            <div>
              <label className="text-gray-400">Name</label>
              <p className="text-lg font-medium">{user.name}</p>
            </div>
            <div>
              <label className="text-gray-400">Email</label>
              <p className="text-lg font-medium">{user.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg mt-4 w-full"
            >
              Log Out
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-400">Loading...</p>
        )}
      </div>
    </div>
  );
}
