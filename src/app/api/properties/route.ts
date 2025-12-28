import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { 
  getCurrentUserWithRole, 
  isAdmin, 
  isOwner, 
  canAccessOwnerFeatures,
  requireRole,
  unauthorizedResponse,
  unauthenticatedResponse,
  isPropertyOwner
} from "@/lib/auth-roles";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Get current user for role-based filtering
    const currentUser = await getCurrentUserWithRole();

    // Single property by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const property = await db
        .select()
        .from(properties)
        .where(eq(properties.id, parseInt(id)))
        .limit(1);

      if (property.length === 0) {
        return NextResponse.json(
          { error: 'Property not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      const prop = property[0];
      
      // Role-based access control for property details
      // Admins can view all properties regardless of status
      // Owners can only view their own properties (all statuses)
      // Guests can only view approved AND published properties
      if (isOwner(currentUser) && !isAdmin(currentUser) && !isPropertyOwner(currentUser, prop.ownerId)) {
        return unauthorizedResponse('You can only view your own properties');
      }
      
      if (!currentUser || (!isAdmin(currentUser) && !isPropertyOwner(currentUser, prop.ownerId))) {
        // Guests and unauthenticated users can only see approved and published properties
        if (!prop.isPublished || prop.status !== 'approved') {
          return NextResponse.json(
            { error: 'Property not found', code: 'NOT_FOUND' },
            { status: 404 }
          );
        }
      }

      // Map property to include legacy field names
      const mappedProperty = {
        ...prop,
        status: prop.isPublished ? 'active' : 'draft',
        town: prop.location,
        max_guests: prop.sleepsMax,
        price_from: prop.priceFromMidweek,
        updated_at: prop.updatedAt,
      };

      return NextResponse.json(mappedProperty);
    }

    // List properties with pagination, search, filters, and sorting
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const page = parseInt(searchParams.get('page') ?? '1');
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset') ?? '0') : (page - 1) * limit;
    const search = searchParams.get('search');
    const region = searchParams.get('region');
    const town = searchParams.get('town');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const isPublished = searchParams.get('isPublished');
    const sortField = searchParams.get('sort') ?? 'createdAt';
    const sortOrder = searchParams.get('order') ?? 'desc';

    let query = db.select().from(properties);

    // Build where conditions
    const conditions = [];

    // Role-based filtering
    // Owners: Only see their own properties (all statuses)
    // Admins: See all properties (all statuses)
    // Guests/Unauthenticated: Only see approved AND published properties
    if (currentUser && isOwner(currentUser) && !isAdmin(currentUser)) {
      conditions.push(eq(properties.ownerId, currentUser.id));
    } else if (!isAdmin(currentUser)) {
      // Guests and unauthenticated users only see approved AND published properties
      conditions.push(eq(properties.isPublished, true));
      conditions.push(eq(properties.status, 'approved'));
    }

    // Search condition
    if (search) {
      conditions.push(
        or(
          like(properties.title, `%${search}%`),
          like(properties.location, `%${search}%`),
          like(properties.region, `%${search}%`)
        )
      );
    }

    // Filter conditions
    if (region) {
      conditions.push(eq(properties.region, region));
    }

    if (town) {
      conditions.push(like(properties.location, `%${town}%`));
    }

    if (status) {
      // Map status filter to isPublished field
      if (status === 'active') {
        conditions.push(eq(properties.isPublished, true));
      } else if (status === 'draft' || status === 'inactive') {
        conditions.push(eq(properties.isPublished, false));
      }
    }

    if (featured !== null && featured !== undefined) {
      const featuredBool = featured === 'true';
      conditions.push(eq(properties.featured, featuredBool));
    }

    if (isPublished !== null && isPublished !== undefined) {
      const isPublishedBool = isPublished === 'true';
      conditions.push(eq(properties.isPublished, isPublishedBool));
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Apply sorting
    const sortColumn = {
      title: properties.title,
      location: properties.location,
      region: properties.region,
      createdAt: properties.createdAt,
      updatedAt: properties.updatedAt,
      priceFromMidweek: properties.priceFromMidweek,
      priceFromWeekend: properties.priceFromWeekend,
    }[sortField] ?? properties.createdAt;

    if (sortOrder === 'asc') {
      query = query.orderBy(asc(sortColumn)) as any;
    } else {
      query = query.orderBy(desc(sortColumn)) as any;
    }

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    // Get total count for pagination
    const countQuery = db.select().from(properties);
    if (conditions.length > 0) {
      countQuery.where(and(...conditions));
    }
    const totalResults = await countQuery;
    const total = totalResults.length;

    // Map properties to include legacy field names for backward compatibility
    const mappedResults = results.map(prop => ({
      ...prop,
      status: prop.isPublished ? 'active' : 'draft',
      town: prop.location,
      max_guests: prop.sleepsMax,
      price_from: prop.priceFromMidweek,
      updated_at: prop.updatedAt,
    }));

    return NextResponse.json({
      properties: mappedResults,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require owner or admin role to create properties
    const currentUser = await requireRole(['owner', 'admin']);
    
    const body = await request.json();

    console.log('POST /properties - Received body:', JSON.stringify(body, null, 2));

    // Validate required fields
    const requiredFields = [
      'title',
      'slug',
      'location',
      'region',
      'sleepsMin',
      'sleepsMax',
      'bedrooms',
      'bathrooms',
      'priceFromMidweek',
      'priceFromWeekend',
      'heroImage',
    ];

    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        console.error(`Missing required field: ${field}`);
        return NextResponse.json(
          {
            error: `Required field '${field}' is missing`,
            code: 'MISSING_REQUIRED_FIELD',
          },
          { status: 400 }
        );
      }
    }

    // Validate numeric fields
    if (body.sleepsMax < body.sleepsMin) {
      return NextResponse.json(
        {
          error: 'sleepsMax must be greater than or equal to sleepsMin',
          code: 'INVALID_SLEEPS_RANGE',
        },
        { status: 400 }
      );
    }

    if (body.priceFromMidweek <= 0 || body.priceFromWeekend <= 0) {
      return NextResponse.json(
        {
          error: 'Prices must be positive values',
          code: 'INVALID_PRICE',
        },
        { status: 400 }
      );
    }

    if (body.bedrooms < 0 || body.bathrooms < 0) {
      return NextResponse.json(
        {
          error: 'Bedrooms and bathrooms must be non-negative',
          code: 'INVALID_ROOM_COUNT',
        },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.slug, body.slug.trim()))
      .limit(1);

    if (existingProperty.length > 0) {
      return NextResponse.json(
        {
          error: 'Slug already exists',
          code: 'DUPLICATE_SLUG',
        },
        { status: 400 }
      );
    }

    // Sanitize and prepare data
    const now = new Date().toISOString();
    const propertyData = {
      title: body.title.trim(),
      slug: body.slug.trim(),
      location: body.location.trim(),
      region: body.region.trim(),
      sleepsMin: parseInt(body.sleepsMin),
      sleepsMax: parseInt(body.sleepsMax),
      bedrooms: parseInt(body.bedrooms),
      bathrooms: parseInt(body.bathrooms),
      priceFromMidweek: parseFloat(body.priceFromMidweek),
      priceFromWeekend: parseFloat(body.priceFromWeekend),
      description: body.description?.trim() || 'No description provided',
      houseRules: body.houseRules?.trim() || null,
      checkInOut: body.checkInOut?.trim() || null,
      iCalURL: body.iCalURL?.trim() || null,
      heroImage: body.heroImage.trim(),
      heroVideo: body.heroVideo?.trim() || null,
      floorplanURL: body.floorplanURL?.trim() || null,
      mapLat: body.mapLat !== undefined && body.mapLat !== null && body.mapLat !== '' ? parseFloat(body.mapLat) : null,
      mapLng: body.mapLng !== undefined && body.mapLng !== null && body.mapLng !== '' ? parseFloat(body.mapLng) : null,
      ownerId: currentUser.id, // Set from authenticated user
      ownerContact: body.ownerContact?.trim() || null,
      featured: body.featured ?? false,
      // Property approval workflow: All new properties default to 'pending' status
      // unless explicitly set by admin
      status: isAdmin(currentUser) ? (body.status || 'pending') : 'pending',
      isPublished: body.isPublished ?? true,
      createdAt: now,
      updatedAt: now,
    };

    // Final validation: ensure no NaN values in numeric fields
    if (propertyData.mapLat !== null && isNaN(propertyData.mapLat)) {
      propertyData.mapLat = null;
    }
    if (propertyData.mapLng !== null && isNaN(propertyData.mapLng)) {
      propertyData.mapLng = null;
    }

    const newProperty = await db
      .insert(properties)
      .values(propertyData)
      .returning();

    return NextResponse.json(newProperty[0], { status: 201 });
  } catch (error: any) {
    console.error('POST /properties error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    
    if (error.message === 'Authentication required') {
      return unauthenticatedResponse();
    }
    if (error.message?.includes('Unauthorized')) {
      return unauthorizedResponse(error.message);
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Require owner or admin role to update properties
    const currentUser = await requireRole(['owner', 'admin']);
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if property exists
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, parseInt(id)))
      .limit(1);

    if (existingProperty.length === 0) {
      return NextResponse.json(
        { error: 'Property not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Check ownership: owners can only update their own properties
    if (!isPropertyOwner(currentUser, existingProperty[0].ownerId)) {
      return unauthorizedResponse('You can only update your own properties');
    }

    const body = await request.json();

    // Validate numeric constraints if provided
    if (body.sleepsMin !== undefined && body.sleepsMax !== undefined) {
      if (body.sleepsMax < body.sleepsMin) {
        return NextResponse.json(
          {
            error: 'sleepsMax must be greater than or equal to sleepsMin',
            code: 'INVALID_SLEEPS_RANGE',
          },
          { status: 400 }
        );
      }
    }

    if (body.priceFromMidweek !== undefined && body.priceFromMidweek <= 0) {
      return NextResponse.json(
        {
          error: 'priceFromMidweek must be a positive value',
          code: 'INVALID_PRICE',
        },
        { status: 400 }
      );
    }

    if (body.priceFromWeekend !== undefined && body.priceFromWeekend <= 0) {
      return NextResponse.json(
        {
          error: 'priceFromWeekend must be a positive value',
          code: 'INVALID_PRICE',
        },
        { status: 400 }
      );
    }

    if (body.bedrooms !== undefined && body.bedrooms < 0) {
      return NextResponse.json(
        {
          error: 'Bedrooms must be non-negative',
          code: 'INVALID_ROOM_COUNT',
        },
        { status: 400 }
      );
    }

    if (body.bathrooms !== undefined && body.bathrooms < 0) {
      return NextResponse.json(
        {
          error: 'Bathrooms must be non-negative',
          code: 'INVALID_ROOM_COUNT',
        },
        { status: 400 }
      );
    }

    // Check slug uniqueness if provided
    if (body.slug) {
      const slugCheck = await db
        .select()
        .from(properties)
        .where(eq(properties.slug, body.slug.trim()))
        .limit(1);

      if (slugCheck.length > 0 && slugCheck[0].id !== parseInt(id)) {
        return NextResponse.json(
          {
            error: 'Slug already exists',
            code: 'DUPLICATE_SLUG',
          },
          { status: 400 }
        );
      }
    }

    // Build update object
    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.slug !== undefined) updates.slug = body.slug.trim();
    if (body.location !== undefined) updates.location = body.location.trim();
    if (body.region !== undefined) updates.region = body.region.trim();
    if (body.sleepsMin !== undefined) updates.sleepsMin = parseInt(body.sleepsMin);
    if (body.sleepsMax !== undefined) updates.sleepsMax = parseInt(body.sleepsMax);
    if (body.bedrooms !== undefined) updates.bedrooms = parseInt(body.bedrooms);
    if (body.bathrooms !== undefined) updates.bathrooms = parseInt(body.bathrooms);
    if (body.priceFromMidweek !== undefined) updates.priceFromMidweek = parseFloat(body.priceFromMidweek);
    if (body.priceFromWeekend !== undefined) updates.priceFromWeekend = parseFloat(body.priceFromWeekend);
    if (body.description !== undefined) updates.description = body.description.trim();
    if (body.houseRules !== undefined) updates.houseRules = body.houseRules?.trim() || null;
    if (body.checkInOut !== undefined) updates.checkInOut = body.checkInOut?.trim() || null;
    if (body.iCalURL !== undefined) updates.iCalURL = body.iCalURL?.trim() || null;
    if (body.heroImage !== undefined) updates.heroImage = body.heroImage.trim();
    if (body.heroVideo !== undefined) updates.heroVideo = body.heroVideo?.trim() || null;
    if (body.floorplanURL !== undefined) updates.floorplanURL = body.floorplanURL?.trim() || null;
    if (body.mapLat !== undefined) updates.mapLat = body.mapLat !== null ? parseFloat(body.mapLat) : null;
    if (body.mapLng !== undefined) updates.mapLng = body.mapLng !== null ? parseFloat(body.mapLng) : null;
    if (body.ownerContact !== undefined) updates.ownerContact = body.ownerContact?.trim() || null;
    if (body.featured !== undefined) updates.featured = body.featured;
    if (body.isPublished !== undefined) updates.isPublished = body.isPublished;

    const updated = await db
      .update(properties)
      .set(updates)
      .where(eq(properties.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error: any) {
    console.error('PUT error:', error);
    if (error.message === 'Authentication required') {
      return unauthenticatedResponse();
    }
    if (error.message?.includes('Unauthorized')) {
      return unauthorizedResponse(error.message);
    }
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Require owner or admin role to delete properties
    const currentUser = await requireRole(['owner', 'admin']);
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if property exists
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, parseInt(id)))
      .limit(1);

    if (existingProperty.length === 0) {
      return NextResponse.json(
        { error: 'Property not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Check ownership: owners can only delete their own properties
    if (!isPropertyOwner(currentUser, existingProperty[0].ownerId)) {
      return unauthorizedResponse('You can only delete your own properties');
    }

    const deleted = await db
      .delete(properties)
      .where(eq(properties.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Property deleted successfully',
      property: deleted[0],
    });
  } catch (error: any) {
    console.error('DELETE error:', error);
    if (error.message === 'Authentication required') {
      return unauthenticatedResponse();
    }
    if (error.message?.includes('Unauthorized')) {
      return unauthorizedResponse(error.message);
    }
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
