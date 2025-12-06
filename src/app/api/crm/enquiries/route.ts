// CRM Enquiries API Route
import { auth } from "@/lib/auth";
import { crmService } from "@/lib/crm-service";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// GET enquiries (owner's or property's)
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");

    let result;
    if (propertyId) {
      result = await crmService.getEnquiriesByProperty(parseInt(propertyId));
    } else {
      result = await crmService.getEnquiriesByOwner(session.user.id);
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ enquiries: result.enquiries });
  } catch (error: any) {
    console.error("Error fetching enquiries:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create enquiry
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Public endpoint - no auth required for guest enquiries
    const result = await crmService.createEnquiry(data);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ enquiry: result.enquiry }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update enquiry
export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: "Enquiry ID required" }, { status: 400 });
    }

    const result = await crmService.updateEnquiry(parseInt(id), updateData);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ enquiry: result.enquiry });
  } catch (error: any) {
    console.error("Error updating enquiry:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
