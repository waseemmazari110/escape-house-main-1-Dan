// CRM Owner Profile API Route
import { auth } from "@/lib/auth";
import { crmService } from "@/lib/crm-service";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// GET owner's CRM profile
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await crmService.getOwnerProfile(session.user.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ profile: result.profile });
  } catch (error: any) {
    console.error("Error fetching CRM profile:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create CRM profile (auto-called on signup)
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const result = await crmService.createOwnerProfile({
      userId: session.user.id,
      ...data,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ profile: result.profile }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating CRM profile:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update CRM profile
export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const result = await crmService.updateOwnerProfile(session.user.id, data);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ profile: result.profile });
  } catch (error: any) {
    console.error("Error updating CRM profile:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
