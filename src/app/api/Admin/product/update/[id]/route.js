import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import Product from "../../../../../../../models/product";
import uploadFile from "../../../../../../../middlewares/upload";
import CheckAuth from "../../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../../utils/logActivity";

export async function PATCH(req, context) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!admin.permissions.includes("update_products")) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const { id } = await context.params;
    const formData = await req.formData();

    const title = formData.get("title")?.trim() || "";
    const slug = formData.get("slug")?.trim() || "";
    const brand = formData.get("brand")?.trim() || "";
    const shortDescription = formData.get("shortDescription")?.trim() || "";

    const stock = Number(formData.get("stock")) || 0;

    const isTrending = formData.get("isTrending") === "true";
    const isBestSeller = formData.get("isBestSeller") === "true";
    const isNewLaunch = formData.get("isNewLaunch") === "true";
    const isSuperSaver = formData.get("isSuperSaver") === "true";

    const benefit = formData.get("benefit")?.trim() || "";
    const ingredient = formData.get("ingredient")?.trim() || "";
    const usage = formData.get("usage")?.trim() || "";

    const description = formData.get("description")?.trim() || "";
    const category = formData.get("category")?.trim() || "";
    const subcategory = formData.get("subcategory")?.trim() || "";

    const tagsString = formData.get("tags") || "";

    const tagsArray = tagsString
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    const returnable = formData.get("returnable") === "true";

    const returnNotes =
      formData.get("returnNotes")?.trim() || "No Return Policy";

    const units = [];
    let i = 0;

    while (formData.get(`units[${i}][unit]`)) {
      const unit = formData.get(`units[${i}][unit]`)?.trim();
      const price = parseFloat(formData.get(`units[${i}][price]`));
      const discount = parseFloat(formData.get(`units[${i}][discount]`));
      const finalPrice = parseFloat(formData.get(`units[${i}][finalPrice]`));

      units.push({
        unit: unit || "",
        price: isNaN(price) ? 0 : price,
        discount: isNaN(discount) ? 0 : discount,
        finalPrice: isNaN(finalPrice) ? 0 : finalPrice,
      });

      i++;
    }

    /* ================= IMAGES ================= */
    const images = formData.getAll("images");
    const imageUrls = [];

    for (const image of images) {
      if (typeof image === "object" && image.name) {
        const uploaded = await uploadFile(image);
        imageUrls.push(uploaded.url);
      }
    }

    /* ================= UPDATE DATA ================= */
    const updateData = {
      title,
      slug,
      brand,
      stock,
      shortDescription,

      isTrending,
      isBestSeller,
      isNewLaunch,
      isSuperSaver,

      benefit,
      ingredient,
      usage,

      description,
      category,
      subcategory,

      tags: tagsArray,

      units,

      returnPolicy: {
        returnable,
        notes: returnNotes,
      },

      ...(imageUrls.length > 0 && { images: imageUrls }),
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    await logActivity(admin, "UPDATE_PRODUCT", `updated product: ${id}`);

    return NextResponse.json(
      {
        message: "Product updated successfully",
        product: updatedProduct,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
