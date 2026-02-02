import { NextResponse } from "next/server";
import { connectDb } from "../../../../../database";
import Coupon from "../../../../../../models/Coupon";
import CheckAuth from "../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../utils/logActivity";

export async function GET(req, { params }) {
  try {
    await connectDb();

    const { id } = await params;

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return NextResponse.json(
        { message: "Coupon not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Coupon fetched successfully", data: coupon },
      { status: 200 },
    );
  } catch (error) {
    console.error("Coupon GET by ID error:", error.message);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDb();

    const { id } = await params;

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return NextResponse.json(
        { message: "Coupon not found" },
        { status: 404 },
      );
    }

    const body = await req.json();

    const code = body?.code ? body.code.toUpperCase().trim() : coupon.code;
    const discountType = body?.discountType || coupon.discountType;
    const discountValue =
      body?.discountValue !== undefined
        ? Number(body.discountValue)
        : coupon.discountValue;

    const minCartValue =
      body?.minCartValue !== undefined
        ? Number(body.minCartValue)
        : coupon.minCartValue;

    const expiryDate = body?.expiryDate || coupon.expiryDate;
    const isActive =
      body?.isActive !== undefined ? body.isActive : coupon.isActive;

    if (code !== coupon.code) {
      const isExisting = await Coupon.findOne({ code });
      if (isExisting) {
        return NextResponse.json(
          { message: "Coupon code already exists" },
          { status: 409 },
        );
      }
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

    coupon.code = code;
    coupon.discountType = discountType;
    coupon.discountValue = discountValue;
    coupon.minCartValue = minCartValue;
    coupon.expiryDate = expiryDate;
    coupon.isActive = isActive;

    const updated = await coupon.save();

    await logActivity(
      admin,
      "UPDATE_COUPON",
      `updated coupon : ${updated.code}`,
    );

    return NextResponse.json(
      { message: "Coupon Updated Successfully", data: updated },
      { status: 200 },
    );
  } catch (error) {
    console.error("Coupon PUT error:", error.message);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    const { id } = await params;

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return NextResponse.json(
        { message: "Coupon not found" },
        { status: 404 },
      );
    }

    await Coupon.findByIdAndDelete(id);

    await logActivity(
      admin,
      "DELETE_COUPON",
      `deleted coupon : ${coupon.code}`,
    );

    return NextResponse.json(
      { message: "Coupon Deleted Successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Coupon DELETE error:", error.message);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
