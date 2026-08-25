import connectDB from '../backend/src/config/db.js';
import app from '../backend/src/app.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to connect to database',
    });
  }
}
