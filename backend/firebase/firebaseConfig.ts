import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBqdXOiZg96QqeMLH0P5N6FDe2Vc6thmlo",
  authDomain: "dip-chat-app.firebaseapp.com",
  projectId: "dip-chat-app",
  storageBucket: "dip-chat-app.firebasestorage.app",
  messagingSenderId: "902219021777",
  appId: "1:902219021777:web:6a9e2b66e16e189e91b4f0",
  measurementId: "G-F50T4PJEEN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getAnalytics(app);


export{db};