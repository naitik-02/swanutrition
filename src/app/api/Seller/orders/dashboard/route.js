import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Order from "../../../../../../models/order";
import mongoose from "mongoose";
import CheckAuth from "../../../../../../middlewares/isAuth";

export async function GET(req) {
  try {
    await connectDb();
    const token = req.cookies.get("adminToken")?.value;

   
    const admin = await CheckAuth(token);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const sellerId = new mongoose.Types.ObjectId(authSeller._id);
   
    const now = new Date();
    const startOfThisWeek = new Date(now);
    const dayOfWeek = now.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; 
    startOfThisWeek.setDate(now.getDate() - daysToMonday);
    startOfThisWeek.setHours(0, 0, 0, 0);
    
    const endOfThisWeek = new Date(startOfThisWeek);
    endOfThisWeek.setDate(startOfThisWeek.getDate() + 7);
    
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
    
    const endOfLastWeek = new Date(startOfThisWeek);

    const stats = await Order.aggregate([
      { $match: { sellerId } },
      {
        $facet: {
          totalOrders: [{ $count: "count" }],
          totalProducts: [
            { $group: { _id: null, total: { $sum: "$totalItems" } } }
          ],
          totalEarnings: [
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
          ],
          
          thisWeekOrders: [
            { 
              $match: { 
                createdAt: { 
                  $gte: startOfThisWeek, 
                  $lt: endOfThisWeek 
                } 
              } 
            },
            { $count: "count" }
          ],
          thisWeekEarnings: [
            { 
              $match: { 
                createdAt: { 
                  $gte: startOfThisWeek, 
                  $lt: endOfThisWeek 
                } 
              } 
            },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
          ],
          
          lastWeekOrders: [
            { 
              $match: { 
                createdAt: { 
                  $gte: startOfLastWeek, 
                  $lt: endOfLastWeek 
                } 
              } 
            },
            { $count: "count" }
          ],
          lastWeekEarnings: [
            { 
              $match: { 
                createdAt: { 
                  $gte: startOfLastWeek, 
                  $lt: endOfLastWeek 
                } 
              } 
            },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
          ],
        },
      },
    ]);

    const result = stats[0];
    const dashboardStats = {
      totalOrders: result.totalOrders[0]?.count || 0,
      totalProducts: result.totalProducts[0]?.total || 0,
      totalEarnings: result.totalEarnings[0]?.total || 0,
      
      // Weekly stats
      thisWeek: {
        orders: result.thisWeekOrders[0]?.count || 0,
        earnings: result.thisWeekEarnings[0]?.total || 0,
      },
      lastWeek: {
        orders: result.lastWeekOrders[0]?.count || 0,
        earnings: result.lastWeekEarnings[0]?.total || 0,
      },
      
      // Growth comparison
      weeklyGrowth: {
        orders: result.thisWeekOrders[0]?.count || 0 - (result.lastWeekOrders[0]?.count || 0),
        earnings: (result.thisWeekEarnings[0]?.total || 0) - (result.lastWeekEarnings[0]?.total || 0),
      }
    };

    return NextResponse.json({ stats: dashboardStats });
  } catch (err) {
    console.error("Stats error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}