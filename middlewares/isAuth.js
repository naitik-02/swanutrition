import jwt from "jsonwebtoken";
import User from "../models/user";
import { connectDb } from "@/database";

const CheckAuth = async (token) => {
  try {
    if (!token) return null;

    await connectDb();

    const decoded = jwt.verify(token, process.env.JWT_SEC);

    const user = await User.findById(decoded.userId);
    return user || null;
  } catch (error) {
    return null;
  }
};

export default CheckAuth;
