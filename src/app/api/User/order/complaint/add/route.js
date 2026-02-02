import { NextResponse } from "next/server";
import { connectDb } from "../../../../../../database";
import uploadFile from "../../../../../../../middlewares/upload";
import Complaint from "../../../../../../../models/complaint";
import CustomerIsAuth from "../../../../../../../middlewares/customerIsAuth";


export async function POST(req) {
  try {
    await connectDb();

 const cookieStore = await cookies();
    const token = cookieStore.get("userToken")?.value; 
        const user = await CustomerIsAuth(token);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formdata = await req.formData();

    const orderId = formdata.get("orderId");
    const message = formdata.get("message");
    const image = formdata.get("image");

    if (!orderId || !message) {
      return NextResponse.json(
        { message: "Order ID, Product ID, and Message are required" },
        { status: 400 }
      );
    }

    let imageUrl = "";
    if (image && typeof image === "object") {
      const uploadedImage = await uploadFile(image);
      imageUrl = uploadedImage?.url || "";
    }

    const newComplaint = await Complaint.create({
      userId: user._id,
      orderId,
      message,
      image: imageUrl,
    });


    return NextResponse.json(
      {
        message: "Complaint submitted successfully",
        data: newComplaint,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Complaint POST error:", error.message);
    return NextResponse.json(
      {
        message: error.message || "Something went wrong while submitting complaint",
      },
      { status: 500 }
    );
  }
}
