import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async (uri) => {
  const mongoURI = uri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/statsusa';

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(mongoURI, opts).then((m) => {
      console.log(`Connected to MongoDB: ${m.connection.host}/${m.connection.name}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error('MongoDB connection error:', error.message);
    if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
};

export default connectDB;
