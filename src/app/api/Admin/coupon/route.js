import { NextResponse } from "next/server";
import { connectDb } from "../../../../database";
import Coupon from "../../../../../models/Coupon";
import CheckAuth from "../../../../../middlewares/isAuth";
import { logActivity } from "../../../../utils/logActivity";

export async function GET(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const coupons = await Coupon.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Coupons fetched successfully", data: coupons },
      { status: 200 },
    );
  } catch (error) {
    console.error("Coupon GET error:", error.message);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    const body = await req.json();
    const code = body?.code?.toUpperCase()?.trim();
    const discountType = body?.discountType;
    const discountValue = Number(body?.discountValue);
    const minCartValue = Number(body?.minCartValue || 0);
    const expiryDate = body?.expiryDate;
    const isActive = body?.isActive ?? true;

    if (!code || !discountType || !discountValue || !expiryDate) {
      return NextResponse.json(
        {
          message: "code, discountType, discountValue, expiryDate are required",
        },
        { status: 400 },
      );
    }

    if (!["PERCENT", "FLAT"].includes(discountType)) {
      return NextResponse.json(
        { message: "Invalid discountType" },
        { status: 400 },
      );
    }

    if (
      discountType === "PERCENT" &&
      (discountValue <= 0 || discountValue > 100)
    ) {
      return NextResponse.json(
        { message: "Percent discount must be between 1 to 100" },
        { status: 400 },
      );
    }

    if (discountType === "FLAT" && discountValue <= 0) {
      return NextResponse.json(
        { message: "Flat discount must be greater than 0" },
        { status: 400 },
      );
    }

    const isExisting = await Coupon.findOne({ code });

    if (isExisting) {
      return NextResponse.json(
        { message: "Coupon Already Exists" },
        { status: 409 },
      );
    }

    const created = await Coupon.create({
      code,
      discountType,
      discountValue,
      minCartValue,
      expiryDate,
      isActive,
    });

    await logActivity(admin, "ADD_COUPON", `add new coupon : ${code}`);

    return NextResponse.json(
      { message: "Coupon Added Successfully", data: created },
      { status: 201 },
    );
  } catch (error) {
    console.error("Coupon POST error:", error.message);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
