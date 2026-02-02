import { NextResponse } from "next/server";
import { connectDb } from "../../../../database";
import Product from "../../../../../models/product";
import Category from "../../../../../models/category";
import Subcategory from "../../../../../models/subcategory";
import Brand from "../../../../../models/brand";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectDb();

    const { searchParams } = req.nextUrl;
    const categoryParam = searchParams.get("category");
    const subcategoryParam = searchParams.get("subcategory");
    const brandParam = searchParams.get("brand");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const isTrending = searchParams.get("isTrending");
    const isBestSeller = searchParams.get("isBestSeller");
    const isSuperSaver = searchParams.get("isSuperSaver");
    const isNewLaunch = searchParams.get("isNewLaunch");

    const filter = {};

    if (categoryParam) {
      if (mongoose.Types.ObjectId.isValid(categoryParam)) {
        filter.category = categoryParam;
      } else {
        const category = await Category.findOne({ slug: categoryParam });
        if (category) {
          filter.category = category._id;
        } else {
          return NextResponse.json(
            {
              message: "Category not found",
              products: [],
              pagination: {
                totalProducts: 0,
                currentPage: page,
                limit,
                totalPages: 0,
              },
            },
            { status: 200 }
          );
        }
      }
    }

    if (subcategoryParam) {
      if (mongoose.Types.ObjectId.isValid(subcategoryParam)) {
        filter.subcategory = subcategoryParam;
      } else {
        const subcategory = await Subcategory.findOne({
          slug: subcategoryParam,
        });
        if (subcategory) {
          filter.subcategory = subcategory._id;
        } else {
          return NextResponse.json(
            {
              message: "Subcategory not found",
              products: [],
              pagination: {
                totalProducts: 0,
                currentPage: page,
                limit,
                totalPages: 0,
              },
            },
            { status: 200 }
          );
        }
      }
    }

    if (brandParam) {
      if (mongoose.Types.ObjectId.isValid(brandParam)) {
        filter.brand = brandParam;
      } else {
        const brand = await Brand.findOne({ slug: brandParam });
        if (brand) {
          filter.brand = brand._id;
        } else {
          return NextResponse.json(
            {
              message: "Brand not found",
              products: [],
              pagination: {
                totalProducts: 0,
                currentPage: page,
                limit,
                totalPages: 0,
              },
            },
            { status: 200 }
          );
        }
      }
    }

    if (status) {
      filter.status = status;
    } else {
      filter.status = "active";
    }


      if (isTrending === "true") {
      filter.isTrending = true;
    }

    if (isBestSeller === "true") {
      filter.isBestSeller = true;
    }

    if (isSuperSaver === "true") {
      filter.isSuperSaver = true;
    }

    if (isNewLaunch === "true") {
      filter.isNewLaunch = true;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate({
        path: "category",
        select: "name slug",
      })
      .populate({
        path: "subcategory",
        select: "name slug",
      })
      .populate({
        path: "brand",
        select: "name slug",
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Products fetched successfully",
        products,
        pagination: {
          totalProducts: total,
          currentPage: page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Product fetch error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
