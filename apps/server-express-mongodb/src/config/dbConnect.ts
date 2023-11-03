import mongoose from "mongoose";
import * as dotenv from 'dotenv';

dotenv.config()

const connectDB = async () => {
  const URI = process.env.DATABASE_URI;
  if (!URI) {
    throw new Error('Database URI is missing');
  }

  try {
    await mongoose.connect(URI)
  } catch (error) {
    console.log(error)
  }
}

export default connectDB