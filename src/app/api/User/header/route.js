import { NextResponse } from "next/server";
import CheckAuth from "../../../../../middlewares/isAuth";
import Header from "../../../../../models/Header";
import { connectDb } from "../../../../database";




export async function GET(req) {
  try {
    await connectDb();

    
    const header = await Header.findOne({});

    return NextResponse.json({ data: header || null }, { status: 200 });
  } catch (error) {
    console.error("GET HEADER ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch header data" },
      { status: 500 }
    );
  }
}