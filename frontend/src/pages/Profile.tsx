import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../utils/uploadToCloudinary"; // ✅ your existing uploader

interface User {
  _id: string;
  name: string;
  email: string;
  profilePic?: string; // ✅ profile image field
}

export default function Profile() {
  const { token, setToken } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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

  // Logout
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/signup");
  };

  // Upload and update profile image
  const handleProfilePicChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      const result = await uploadToCloudinary(file);
      console.log("this is a resut ", result, result?.url);
      console.log("token:", token)
      if (!result?.url) throw new Error("Upload failed");

      // Send to backend
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile-picture`,
        { profilePic: result.url },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update UI
      setUser({ ...user, profilePic: result.url });
    } catch (error) {
      console.error("Profile picture update failed", error);
      alert("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center px-4">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>

        {user ? (
          <div className="space-y-4">
            {/* 👤 Avatar */}
            <div className="flex flex-col items-center gap-2">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold uppercase">
                  {user.name[0]}
                </div>
              )}

             
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleProfilePicChange}
                className="hidden"
              />
            </div>

            {/* Name & Email */}
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
