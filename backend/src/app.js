import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
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
