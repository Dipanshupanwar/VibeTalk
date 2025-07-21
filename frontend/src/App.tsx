import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import OtpVerification from "./pages/OtpVerification";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import LoginWithPassword from "./pages/LoginWithPassword";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import RedirectToDashboard from "./routes/RedirectToDashboard";
import ChatPage from "./components/ChatPage";
import { ChatProvider } from "./context/chatContext";

function AppRoutes() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/chat/");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<RedirectToDashboard />} />
        <Route path="/verify" element={<OtpVerification />} />
        <Route path="/login" element={<LoginWithPassword />} />
        <Route path="/signup" element={<Login />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:userId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatpage"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
