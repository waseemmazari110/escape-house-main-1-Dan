// CRM Activity Log API Route
import { auth } from "@/lib/auth";
import { crmService } from "@/lib/crm-service";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// GET activities for an entity
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get("entityType");
    const entityId = searchParams.get("entityId");

    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: "entityType and entityId required" },
        { status: 400 }
      );
    }

    const result = await crmService.getActivities(entityType, entityId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ activities: result.activities });
  } catch (error: any) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST log new activity
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const result = await crmService.logActivity({
      ...data,
      performedBy: session.user.id,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Error logging activity:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
