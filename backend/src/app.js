import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import datasetRoutes from './routes/datasetRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Ensure database connection before processing API requests (for Serverless/Vercel)
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 1 || process.env.NODE_ENV === 'test') {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/datasets', datasetRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
