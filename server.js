import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import cors from "cors";
import categryRoutes from "./routes/categoryRoutes.js";
import productRoues from "./routes/productRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';

// ES6 module __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// configure env
dotenv.config();

// connect to database
connectDB();

// rest object
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categryRoutes);
app.use('/api/v1/product', productRoues);

// serve static files (React build)
app.use(express.static(path.join(__dirname, './client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

// port
const PORT = process.env.PORT || 8080;

// listen
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`.bgCyan.white);
});
