import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, phone, propertyName, propertyAddress, companyName, role } = body;

    // Use either userId or email to find the user
    let userIdentifier;
    if (userId) {
      userIdentifier = eq(user.id, userId);
    } else if (email) {
      userIdentifier = eq(user.email, email);
    } else {
      return NextResponse.json(
        { error: "User ID or email is required" },
        { status: 400 }
      );
    }

    // Update user with additional owner information
    await db
      .update(user)
      .set({
        role: role || "owner",
        phone: phone || null,
        companyName: companyName || propertyName || null,
        updatedAt: new Date(),
      })
      .where(userIdentifier);

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
