import mongoose from "mongoose";
import Env from "../utils/Env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(Env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
