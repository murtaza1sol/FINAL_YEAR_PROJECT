import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get("wallet");

    if (!wallet) {
      return NextResponse.json(
        { error: "Missing wallet parameter" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("doctordb");

    // Check in 'doctors' collection instead of 'users'
    const doctor = await db
      .collection("doctors")
      .findOne({ walletAddress: wallet });

    if (doctor) {
      return NextResponse.json({ exists: true, doctor }, { status: 200 });
    } else {
      return NextResponse.json({ exists: false }, { status: 200 });
    }
  } catch (err) {
    console.error("Error checking doctor:", err);
    return NextResponse.json(
      { error: "Error checking doctor", details: err.message },
      { status: 500 }
    );
  }
}

export function POST() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
