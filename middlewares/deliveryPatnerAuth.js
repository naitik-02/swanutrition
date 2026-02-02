import jwt from "jsonwebtoken";
import { connectDb } from "../src/database";
import DeliveryPartner from "../models/deliveryPatner";

const DeliveryPartnerIsAuth = async (token) => {
  try {
    if (!token) return null;

    await connectDb();

    const decoded = jwt.verify(token, process.env.JWT_SEC);

    const partner = await DeliveryPartner.findById(decoded.userId);
    return partner || null;
  } catch (error) {
    return null;
  }
};

export default DeliveryPartnerIsAuth;
