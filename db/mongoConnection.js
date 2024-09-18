import mongoose from 'mongoose';

export const mongo = () =>
  mongoose
    .connect(process.env.MONGO_DB2)
    .then(() => {
      console.log('MongoDB connected');
    })
    .catch((err) => {
      console.log('Error connecting to MongoDB:', err);
    });

// Create a separate connection for the second MongoDB


