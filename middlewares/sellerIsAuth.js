// import jwt from "jsonwebtoken";
//  import Seller from "../models/seller";
// import { connectDb } from "@/database";

// const CheckSellerAuth = async (token) => {
//   try {
//     if (!token) return null;

//     await connectDb();
//     const decoded = jwt.verify(token, process.env.JWT_SEC);

//     const seller = await Seller.findById(decoded.sellerId);
//     return seller || null;
//   } catch (error) {
//     return null;
//   }
// };

// export default CheckSellerAuth;
