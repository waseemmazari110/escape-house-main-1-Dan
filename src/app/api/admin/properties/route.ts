import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, propertyImages, propertyFeatures } from '@/db/schema';
import { eq, desc, and, like } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// GET - List all properties for admin
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const isPublished = searchParams.get('isPublished');
    const isFeatured = searchParams.get('isFeatured');

    // Build conditions
    const conditions = [];
    
    if (isPublished !== null && isPublished !== undefined) {
      conditions.push(eq(properties.isPublished, isPublished === 'true'));
    }

    if (isFeatured !== null && isFeatured !== undefined) {
      conditions.push(eq(properties.featured, isFeatured === 'true'));
    }

    if (search) {
      conditions.push(like(properties.title, `%${search}%`));
    }

    // Get properties
    let query = db
      .select()
      .from(properties)
      .orderBy(desc(properties.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    const allProperties = conditions.length > 0
      ? await db
          .select()
          .from(properties)
          .where(and(...conditions))
          .orderBy(desc(properties.createdAt))
          .limit(limit)
          .offset((page - 1) * limit)
      : await query;

    // Get total count
    const totalProperties = await db.select().from(properties);
    const total = totalProperties.length;

    return NextResponse.json({
      properties: allProperties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// POST - Create new property
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const now = new Date().toISOString();

    const result = await db.insert(properties).values({
      ...body,
      createdAt: now,
      updatedAt: now,
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}

// PATCH - Update property
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Property ID required' }, { status: 400 });
    }

    const body = await request.json();
    const now = new Date().toISOString();

    await db
      .update(properties)
      .set({
        ...body,
        updatedAt: now,
      })
      .where(eq(properties.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

// DELETE - Delete property
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Property ID required' }, { status: 400 });
    }

    // Delete related records first
    await db.delete(propertyImages).where(eq(propertyImages.propertyId, parseInt(id)));
    await db.delete(propertyFeatures).where(eq(propertyFeatures.propertyId, parseInt(id)));
    await db.delete(properties).where(eq(properties.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
