/**
 * Admin Pending Properties API
 * 
 * GET /api/admin/properties/pending - List all pending property submissions
 * 
 * Admin-only endpoint to view all properties awaiting approval.
 * Supports filtering and pagination.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, user } from '@/db/schema';
import { eq, desc, sql, and } from 'drizzle-orm';
import { nowUKFormatted } from '@/lib/date-utils';
import { 
  getCurrentUserWithRole, 
  isAdmin,
  unauthorizedResponse,
  unauthenticatedResponse
} from "@/lib/auth-roles";

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const currentUser = await getCurrentUserWithRole();

    if (!currentUser) {
      return unauthenticatedResponse('Please log in to access this resource');
    }

    // Admin role check
    if (!isAdmin(currentUser)) {
      return unauthorizedResponse('Admin access required');
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get('status') || 'pending'; // 'pending', 'approved', 'rejected', 'all'
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    let whereClause;
    if (statusFilter === 'all') {
      whereClause = undefined; // No filter
    } else if (['pending', 'approved', 'rejected'].includes(statusFilter)) {
      whereClause = eq(properties.status, statusFilter as 'pending' | 'approved' | 'rejected');
    } else {
      whereClause = eq(properties.status, 'pending'); // Default to pending
    }

    // Fetch properties with owner information
    const propertiesList = await db
      .select({
        // Property fields
        id: properties.id,
        title: properties.title,
        slug: properties.slug,
        location: properties.location,
        region: properties.region,
        status: properties.status,
        rejectionReason: properties.rejectionReason,
        approvedBy: properties.approvedBy,
        approvedAt: properties.approvedAt,
        ownerId: properties.ownerId,
        featured: properties.featured,
        isPublished: properties.isPublished,
        createdAt: properties.createdAt,
        updatedAt: properties.updatedAt,
        heroImage: properties.heroImage,
        
        // Owner fields
        ownerName: user.name,
        ownerEmail: user.email,
        ownerCompany: user.companyName,
      })
      .from(properties)
      .leftJoin(user, eq(properties.ownerId, user.id))
      .where(whereClause)
      .orderBy(desc(properties.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(properties)
      .where(whereClause);

    const totalCount = countResult[0]?.count || 0;

    // Get status counts
    const statusCounts = await db
      .select({
        status: properties.status,
        count: sql<number>`count(*)`,
      })
      .from(properties)
      .groupBy(properties.status);

    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: totalCount,
    };

    statusCounts.forEach(item => {
      if (item.status === 'pending') counts.pending = item.count;
      if (item.status === 'approved') counts.approved = item.count;
      if (item.status === 'rejected') counts.rejected = item.count;
    });

    return NextResponse.json(
      {
        success: true,
        properties: propertiesList.map(prop => ({
          id: prop.id,
          title: prop.title,
          slug: prop.slug,
          location: prop.location,
          region: prop.region,
          status: prop.status,
          rejectionReason: prop.rejectionReason,
          approvedBy: prop.approvedBy,
          approvedAt: prop.approvedAt,
          heroImage: prop.heroImage,
          featured: prop.featured,
          isPublished: prop.isPublished,
          createdAt: prop.createdAt,
          updatedAt: prop.updatedAt,
          owner: {
            id: prop.ownerId,
            name: prop.ownerName,
            email: prop.ownerEmail,
            company: prop.ownerCompany,
          },
        })),
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount,
        },
        statusCounts: counts,
        timestamp: nowUKFormatted(),
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching pending properties:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch properties',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
