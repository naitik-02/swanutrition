import { parse } from "csv-parse/sync";
import mongoose from "mongoose";
import { connectDb } from "../../../../../database";
import Product from "../../../../../../models/product";
import CheckAuth from "../../../../../../middlewares/isAuth";
import { logActivity } from "../../../../../utils/logActivity";

export async function POST(req) {
  try {
    await connectDb();

    const token = req.cookies.get("adminToken")?.value;
    const admin = await CheckAuth(token);

    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const updateExisting = formData.get("updateExisting") === "true";
    const skipDuplicates = formData.get("skipDuplicates") === "true";

    if (!file || file.size === 0) {
      return new Response(JSON.stringify({ message: "No file provided" }), {
        status: 400,
      });
    }

    const csvContent = await file.text();
    let records;

    try {
      records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    } catch (parseError) {
      return new Response(
        JSON.stringify({
          message: "Invalid CSV format",
          error: parseError.message,
        }),
        { status: 400 }
      );
    }

    if (records.length === 0) {
      return new Response(JSON.stringify({ message: "CSV file is empty" }), {
        status: 400,
      });
    }

    const results = {
      total: records.length,
      imported: 0,
      updated: 0,
      skipped: 0,
      errors: [],
    };

    const existingProducts = new Map();

    const createSlug = (title) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    };

    // Process each record
    for (let i = 0; i < records.length; i++) {
      const record = records[i];

      try {
        // Skip if no title (required field)
        if (!record.title || record.title.trim() === "") {
          results.skipped++;
          results.errors.push({
            row: i + 2, // +2 for header row and 0-based index
            message: "Missing required field: title",
          });
          continue;
        }

        // Generate slug if not provided
        const slug = record.slug || createSlug(record.title);

        // Check if product exists by slug or title
        const existingProduct = await Product.findOne({
          $or: [{ slug: slug }],
        });

        if (existingProduct) {
          if (skipDuplicates) {
            results.skipped++;
            continue;
          } else if (!updateExisting) {
            results.skipped++;
            results.errors.push({
              row: i + 2,
              message: "Product already exists (use update mode to modify)",
            });
            continue;
          }
        }

        // Prepare product data
        const productData = {
          title: record.title.trim(),
          slug: slug,
          description: record.description || "",
          features: record.features || "",
          shelfLife: record.shelfLife || "",
          countryOfOrigin: record.countryOfOrigin || "",
          fssaiLicense: record.fssaiLicense || "",
          stock: parseInt(record.stock) || 0,
          sold: parseInt(record.sold) || 0,
        };

        // Handle returnable field
        if (record.returnable !== undefined) {
          productData.returnable =
            record.returnable === "true" ||
            record.returnable === "1" ||
            record.returnable === true;
        }

        if (record.returnPolicyNotes !== undefined) {
          productData.returnPolicyNotes = record.returnPolicyNotes;
        }

        // Handle JSON fields
        if (record.units) {
          try {
            productData.units = JSON.parse(record.units);
          } catch (e) {
            productData.units = [];
          }
        }

        if (record.images) {
          try {
            productData.images = JSON.parse(record.images);
          } catch (e) {
            productData.images = [];
          }
        }

        // Handle ObjectId fields if they exist
        if (
          record.category &&
          mongoose.Types.ObjectId.isValid(record.category)
        ) {
          productData.category = record.category;
        }

        if (
          record.subcategory &&
          mongoose.Types.ObjectId.isValid(record.subcategory)
        ) {
          productData.subcategory = record.subcategory;
        }

        if (record.brand && mongoose.Types.ObjectId.isValid(record.brand)) {
          productData.brand = record.brand;
        }

        // Save or update product
        if (existingProduct && updateExisting) {
          await Product.findByIdAndUpdate(existingProduct._id, productData);
          results.updated++;
        } else {
          await Product.create(productData);
          results.imported++;
        }
      } catch (error) {
        results.errors.push({
          row: i + 2,
          message: error.message,
          data: record.title || "Unknown product",
        });
      }
    }


               await logActivity(admin, "IMPORT_PRODUCTS", `imported products`);


    return new Response(
      JSON.stringify({
        success: true,
        message: `Import completed. ${results.imported} imported, ${results.updated} updated, ${results.skipped} skipped`,
        results,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Import error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Internal Server Error",
      }),
      { status: 500 }
    );
  }
}
