import { useState } from "react";
import { verifyOtp } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function OTPVerification() {
  const [otp, setOtp] = useState("");
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await verifyOtp({ email: email!, otp });
      setToken(res.data.token);
      alert("Login successful 🎉");
      navigate("/dashboard"); // Next page
    } catch (err) {
      alert("Invalid OTP ❌");
    }
  };

  return (
    <div>
      <h2>Enter OTP</h2>
      <form onSubmit={handleVerify}>
        <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" required />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}

export default OTPVerification;
