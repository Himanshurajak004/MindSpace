
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();

    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully!",
    });
  } catch (error) {
    console.error("MongoDB test failed:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "MongoDB connection failed. Check your terminal.",
      },
      { status: 500 }
    );
  }
}
