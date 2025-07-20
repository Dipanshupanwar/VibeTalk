import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/auth`;

export const sendOtp = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return axios.post(`${API}/send-otp`, data);
};

export const verifyOtp = (data: { email: string; otp: string }) => {
  return axios.post(`${API}/verify`, data);
};
