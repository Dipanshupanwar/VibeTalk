import { FaUserCircle, FaEnvelope } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigate without stacking same route in history
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
          className="text-xl font-bold cursor-pointer hover:text-blue-400 transition"
          onClick={() => handleNavigation("/dashboard")}
        >
          DipChat
        </div>

        {/* Right: Icons and profile */}
        <div className="flex items-center space-x-6">
          {/* Messages */}
          <div
            onClick={() => handleNavigation("/dashboard")}
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
