import { FaUserCircle, FaEnvelope } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";


export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left: Logo */}
       <div
  className="flex items-center space-x-3 cursor-pointer group"
  onClick={() => handleNavigation("/dashboard")}
>
  <div className="p-1 bg-white rounded-full shadow-md group-hover:scale-105 transition-transform duration-200">
    <img
      src="/assets/bytecipher_logo.png" // ✅ Adjust as needed
      alt="Logo"
      className="h-8 w-8 object-contain"
    />
  </div>
  <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors duration-200">
    ByteChat
  </span>
</div>



        {/* Right: Icons and profile */}
        <div className="flex items-center space-x-6">
          {/* ✅ Messages */}
          <div
            onClick={() => handleNavigation("/chatpage")}
            className="flex items-center space-x-1 cursor-pointer hover:text-blue-400 transition"
          >
            <FaEnvelope className="text-lg" />
            <span className="hidden sm:inline">Messages</span>
          </div>

          {/* Profile */}
          <div
            onClick={() => handleNavigation("/profile")}
            className="flex items-center space-x-1 cursor-pointer hover:text-blue-400 transition"
          >
            <FaUserCircle className="text-lg" />
            <span className="hidden sm:inline">Profile</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
