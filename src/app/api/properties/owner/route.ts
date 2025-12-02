import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { properties, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Fetch properties owned by this user
    const ownerProperties = await db
      .select()
      .from(properties)
      .where(eq(properties.ownerId, userId));

    return NextResponse.json({
      success: true,
      properties: ownerProperties || [],
    });
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
