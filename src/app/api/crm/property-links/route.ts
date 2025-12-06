// CRM Property Links API Route
import { auth } from "@/lib/auth";
import { crmService } from "@/lib/crm-service";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// GET owner's linked properties
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await crmService.getOwnerProperties(session.user.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ properties: result.properties });
  } catch (error: any) {
    console.error("Error fetching property links:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST link property to owner
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const result = await crmService.linkPropertyToOwner({
      ownerId: session.user.id,
      ...data,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ link: result.link }, { status: 201 });
  } catch (error: any) {
    console.error("Error linking property:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
