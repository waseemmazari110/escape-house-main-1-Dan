import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const session = await auth.api.getSession({ headers: await headers() });
    clearTimeout(timeoutId);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized", authenticated: false },
        { status: 401 }
      );
    }

    // Fetch complete user profile
    const [userProfile] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!userProfile) {
      // User in session but not in database - session is stale
      return NextResponse.json(
        { error: "User not found", authenticated: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: userProfile.id,
      name: userProfile.name,
      email: userProfile.email,
      role: userProfile.role,
      phone: userProfile.phone,
      companyName: userProfile.companyName,
      emailVerified: userProfile.emailVerified,
      image: userProfile.image,
      createdAt: userProfile.createdAt,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    
    // Return 401 for auth-related errors, 500 for others
    const isAuthError = error instanceof Error && 
      (error.message.includes('session') || error.message.includes('unauthorized'));
    
    return NextResponse.json(
      { 
        error: "Failed to fetch profile",
        authenticated: !isAuthError 
      },
      { status: isAuthError ? 401 : 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, phone, companyName } = body;

    // Update user profile
    await db
      .update(user)
      .set({
        name: name || session.user.name,
        phone: phone || null,
        companyName: companyName || null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
