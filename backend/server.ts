import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';


import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import { connectDB } from './config/db';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.all('*', (req, res) => {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
});




// ✅ Connect to MongoDB
connectDB();

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);


