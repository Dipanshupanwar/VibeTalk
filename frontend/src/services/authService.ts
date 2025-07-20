import axios from "axios";

const API = "http://localhost:5000/api/auth";

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
