/**
 * Multi-Property Management API
 * 
 * GET /api/properties/portfolio - Get owner's portfolio
 * POST /api/properties/bulk - Execute bulk operations
 * GET /api/properties/compare - Compare properties
 * GET /api/properties/cross-availability - Cross-property availability
 * 
 * Milestone 8: Amenities, Pricing, Multi-Property
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  getPropertyPortfolio,
  executeBulkOperation,
  compareProperties,
  getCrossPropertyAvailability,
  getPortfolioPerformance,
  type BulkOperation,
} from '@/lib/multi-property';
import { logAuditEvent } from '@/lib/audit-logger';

/**
 * GET /api/properties/portfolio
 * Get owner's property portfolio
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only owners and admins can view portfolios
    if (((session.user as any).role || 'guest') !== 'owner' && ((session.user as any).role || 'guest') !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Only property owners can view portfolios' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'portfolio';

    if (action === 'portfolio') {
      return await handlePortfolio(req, session.user.id);
    } else if (action === 'performance') {
      return await handlePerformance(req, session.user.id);
    } else if (action === 'compare') {
      return await handleCompare(req);
    } else if (action === 'cross-availability') {
      return await handleCrossAvailability(req);
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Portfolio API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/properties/portfolio
 * Execute bulk operations
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only owners and admins can execute bulk operations
    if (((session.user as any).role || 'guest') !== 'owner' && ((session.user as any).role || 'guest') !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Only property owners can execute bulk operations' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action } = body;

    if (action === 'bulk') {
      return await handleBulkOperation(req, session.user.id, body);
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: bulk' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Bulk operation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// GET PORTFOLIO
// ============================================

async function handlePortfolio(req: NextRequest, ownerId: string) {
  const portfolio = await getPropertyPortfolio(ownerId);

  return NextResponse.json({
    success: true,
    portfolio,
  });
}

// ============================================
// GET PERFORMANCE
// ============================================

async function handlePerformance(req: NextRequest, ownerId: string) {
  const performance = await getPortfolioPerformance(ownerId);

  return NextResponse.json({
    success: true,
    performance,
  });
}

// ============================================
// COMPARE PROPERTIES
// ============================================

async function handleCompare(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const propertyIdsParam = searchParams.get('propertyIds');

  if (!propertyIdsParam) {
    return NextResponse.json(
      { error: 'Missing required parameter: propertyIds (comma-separated)' },
      { status: 400 }
    );
  }

  const propertyIds = propertyIdsParam.split(',').map(id => parseInt(id.trim()));

  if (propertyIds.some(isNaN)) {
    return NextResponse.json(
      { error: 'Invalid property IDs' },
      { status: 400 }
    );
  }

  if (propertyIds.length < 2) {
    return NextResponse.json(
      { error: 'At least 2 properties are required for comparison' },
      { status: 400 }
    );
  }

  const comparison = await compareProperties(propertyIds);

  return NextResponse.json({
    success: true,
    comparison,
  });
}

// ============================================
// CROSS-PROPERTY AVAILABILITY
// ============================================

async function handleCrossAvailability(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const propertyIdsParam = searchParams.get('propertyIds');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!propertyIdsParam || !startDate || !endDate) {
    return NextResponse.json(
      { error: 'Missing required parameters: propertyIds, startDate, endDate' },
      { status: 400 }
    );
  }

  const propertyIds = propertyIdsParam.split(',').map(id => parseInt(id.trim()));

  if (propertyIds.some(isNaN)) {
    return NextResponse.json(
      { error: 'Invalid property IDs' },
      { status: 400 }
    );
  }

  // Validate UK date format
  const ukDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!ukDateRegex.test(startDate) || !ukDateRegex.test(endDate)) {
    return NextResponse.json(
      { error: 'Dates must be in UK format: DD/MM/YYYY' },
      { status: 400 }
    );
  }

  const availability = await getCrossPropertyAvailability(propertyIds, startDate, endDate);

  return NextResponse.json({
    success: true,
    propertyIds,
    startDate,
    endDate,
    availability,
  });
}

// ============================================
// BULK OPERATION
// ============================================

async function handleBulkOperation(req: NextRequest, ownerId: string, body: any) {
  const { operation, propertyIds, params } = body;

  if (!operation || !Array.isArray(propertyIds) || propertyIds.length === 0) {
    return NextResponse.json(
      { error: 'Missing required fields: operation, propertyIds' },
      { status: 400 }
    );
  }

  const validOperations = ['publish', 'unpublish', 'update-pricing', 'update-amenities', 'delete'];
  if (!validOperations.includes(operation)) {
    return NextResponse.json(
      { error: `Invalid operation. Use: ${validOperations.join(', ')}` },
      { status: 400 }
    );
  }

  const bulkOp: BulkOperation = {
    operation,
    propertyIds,
    params,
  };

  const result = await executeBulkOperation(ownerId, bulkOp);

  // Log audit event
  await logAuditEvent({
    userId: ownerId,
    action: 'property.update',
    resourceType: 'property',
    resourceId: 'bulk',
    details: {
      operation,
      propertyIds,
      successful: result.success,
      failed: result.failed,
    },
    ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
    userAgent: req.headers.get('user-agent') || 'unknown',
  });

  return NextResponse.json({
    success: true,
    result,
  });
}
