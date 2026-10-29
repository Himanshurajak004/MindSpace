
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const body = await request.json();

    if (
      !body.text?.trim() ||
      !body.mood?.name ||
      typeof body.mood.score !== "number"
    ) {
      return NextResponse.json(
        { success: false, message: "Journal text and mood are required." },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db("mindspace");

    const entry = {
      text: body.text.trim(),
      mood: body.mood,
      date: new Date().toLocaleDateString("en-US"),
      createdAt: new Date(),
    };

    const result = await db.collection("entries").insertOne(entry);

    return NextResponse.json(
      {
        success: true,
        message: "Journal entry saved to MongoDB!",
        id: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Saving journal entry failed:", error.message);

    return NextResponse.json(
      { success: false, message: "Could not save journal entry." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db("mindspace");

    const entries = await db
      .collection("entries")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedEntries = entries.map((entry) => ({
      id: entry._id.toString(),
      text: entry.text,
      mood: entry.mood,
      date: entry.date,
      createdAt: entry.createdAt,
    }));

    return NextResponse.json({
      success: true,
      entries: formattedEntries,
    });
  } catch (error) {
    console.error("Fetching journal entries failed:", error.message);

    return NextResponse.json(
      { success: false, message: "Could not fetch journal entries." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid entry ID." },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db("mindspace");

    const result = await db.collection("entries").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Entry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Journal entry deleted successfully.",
    });
  } catch (error) {
    console.error("Deleting journal entry failed:", error.message);

    return NextResponse.json(
      { success: false, message: "Could not delete journal entry." },
      { status: 500 }
    );
  }
}
