import jwt from "jsonwebtoken";
import User from "../models/user";
import { connectDb } from "@/database";
import Customer from "../models/customer";

const CustomerIsAuth = async (token) => {
  try {
    if (!token) return null;

    await connectDb();

    const decoded = jwt.verify(token, process.env.JWT_SEC);

    const user = await Customer.findById(decoded.userId);
    return user || null;
  } catch (error) {
    return null;
  }
};

export default CustomerIsAuth;
