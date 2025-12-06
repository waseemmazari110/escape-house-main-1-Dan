import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, session as sessionTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email.toLowerCase()))
      .limit(1);

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create session token
    const sessionId = crypto.randomUUID();
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db.insert(sessionTable).values({
      id: sessionId,
      userId: existingUser.id,
      token,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      message: "Session created successfully",
    });

    response.cookies.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Create session error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
