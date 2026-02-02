import mongoose from "mongoose";

let isConnected = false;

export const connectDb = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.URL, {
      dbName: "Cosmatics",
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};
