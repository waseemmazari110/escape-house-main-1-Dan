import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is an owner
    if ((session.user as any).role !== 'owner') {
      return NextResponse.json(
        { error: 'Access denied. Owner role required.' },
        { status: 403 }
      );
    }

    // Fetch properties owned by this user
    const ownerProperties = await db
      .select()
      .from(properties)
      .where(eq(properties.ownerId, session.user.id));

    return NextResponse.json({
      success: true,
      properties: ownerProperties,
    });
  } catch (error) {
    console.error('Error fetching owner properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is an owner
    if ((session.user as any).role !== 'owner') {
      return NextResponse.json(
        { error: 'Access denied. Owner role required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      location,
      region,
      sleepsMin,
      sleepsMax,
      bedrooms,
      bathrooms,
      priceFromMidweek,
      priceFromWeekend,
      description,
      heroImage,
    } = body;

    // Create new property
    const newProperty = await db.insert(properties).values({
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      location,
      region,
      sleepsMin,
      sleepsMax,
      bedrooms,
      bathrooms,
      priceFromMidweek,
      priceFromWeekend,
      description,
      heroImage,
      ownerId: session.user.id,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();

    return NextResponse.json({
      success: true,
      property: newProperty[0],
    });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
