import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Handle both GET and POST for session retrieval
export async function GET() {
  try {
    const session = await auth.api.getSession({ 
      headers: await headers() 
    });
    
    return NextResponse.json(session || { user: null, session: null });
  } catch (error) {
    console.error("Session retrieval error:", error);
    return NextResponse.json({ user: null, session: null }, { status: 200 });
  }
}

export async function POST() {
  // Redirect POST requests to GET handler
  return GET();
}
