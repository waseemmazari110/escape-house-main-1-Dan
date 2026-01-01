// CRM Notes API Route
import { auth } from "@/lib/auth";
import { crmService } from "@/lib/crm-service";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// GET notes for an entity
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || ((session.user as any).role || 'guest') !== "owner") {
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

    const result = await crmService.getNotes(entityType, entityId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ notes: result.notes });
  } catch (error: any) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create note
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || ((session.user as any).role || 'guest') !== "owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const result = await crmService.createNote({
      ...data,
      createdBy: session.user.id,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ note: result.note }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating note:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update note
export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || ((session.user as any).role || 'guest') !== "owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: "Note ID required" }, { status: 400 });
    }

    const result = await crmService.updateNote(parseInt(id), updateData);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ note: result.note });
  } catch (error: any) {
    console.error("Error updating note:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
