import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, phone, companyName, role } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Update user with additional owner information
    await db
      .update(user)
      .set({
        role: role || "owner",
        phone: phone || null,
        companyName: companyName || null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));

    return NextResponse.json({
      success: true,
      message: "Owner profile completed successfully",
    });
  } catch (error) {
    console.error("Complete signup error:", error);
    return NextResponse.json(
      { error: "Failed to complete signup" },
      { status: 500 }
    );
  }
}
