import mongoose from 'mongoose';

export const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    throw new Error('Error connecting to MongoDB');
  }
};
