/**
 * MILESTONE 9: PERFORMANCE STATS API
 * 
 * API endpoints for performance statistics
 * GET: Retrieve stats, comparisons, time-series data
 * POST: Calculate and save stats for entities
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import {
  savePerformanceStats,
  getPerformanceStats,
  getLatestStats,
  calculatePropertyStats,
  calculateOwnerStats,
  calculatePlatformStats,
  comparePerformance,
  getTimeSeriesData,
  type CreateStatsData,
  type StatsFilters,
  type EntityType,
  type Period,
} from '@/lib/performance-stats';

// ============================================
// GET - Retrieve Performance Stats
// ============================================

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Please login',
      }, { status: 401 });
    }

    const userRole = session.user.role;
    const userId = session.user.id;

    // Admin can see all stats, owners can see their own stats
    if (userRole !== 'admin' && userRole !== 'owner') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin or Owner access required',
      }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'list';

    switch (action) {
      case 'list': {
        const filters: StatsFilters = {};

        const entityType = searchParams.get('entityType') as EntityType | null;
        if (entityType) filters.entityType = entityType;

        const entityId = searchParams.get('entityId');
        if (entityId) {
          // Owners can only view their own stats
          if (userRole === 'owner' && entityType === 'owner' && entityId !== userId) {
            return NextResponse.json({
              success: false,
              error: 'Unauthorized - Cannot view other owner stats',
            }, { status: 403 });
          }
          filters.entityId = entityId;
        }

        const period = searchParams.get('period') as Period | null;
        if (period) filters.period = period;

        const dateFrom = searchParams.get('dateFrom');
        if (dateFrom) filters.dateFrom = dateFrom;

        const dateTo = searchParams.get('dateTo');
        if (dateTo) filters.dateTo = dateTo;

        const limit = parseInt(searchParams.get('limit') || '100');

        const stats = await getPerformanceStats(filters, limit);

        return NextResponse.json({
          success: true,
          stats,
          total: stats.length,
          filters,
        });
      }

      case 'latest': {
        const entityType = searchParams.get('entityType') as EntityType;
        const entityId = searchParams.get('entityId');
        const period = (searchParams.get('period') || 'daily') as Period;

        if (!entityType) {
          return NextResponse.json({
            success: false,
            error: 'Entity type required',
          }, { status: 400 });
        }

        // Authorization check
        if (userRole === 'owner' && entityType === 'owner' && entityId !== userId) {
          return NextResponse.json({
            success: false,
            error: 'Unauthorized - Cannot view other owner stats',
          }, { status: 403 });
        }

        const stats = await getLatestStats(entityType, entityId || undefined, period);

        return NextResponse.json({
          success: true,
          stats,
        });
      }

      case 'property': {
        const propertyId = searchParams.get('propertyId');
        const period = (searchParams.get('period') || 'monthly') as Period;

        if (!propertyId) {
          return NextResponse.json({
            success: false,
            error: 'Property ID required',
          }, { status: 400 });
        }

        // TODO: Verify property ownership if owner role

        const metrics = await calculatePropertyStats(parseInt(propertyId), period);

        return NextResponse.json({
          success: true,
          propertyId: parseInt(propertyId),
          period,
          metrics,
        });
      }

      case 'owner': {
        const ownerId = searchParams.get('ownerId') || userId;
        const period = (searchParams.get('period') || 'monthly') as Period;

        // Owners can only view their own stats
        if (userRole === 'owner' && ownerId !== userId) {
          return NextResponse.json({
            success: false,
            error: 'Unauthorized - Cannot view other owner stats',
          }, { status: 403 });
        }

        const metrics = await calculateOwnerStats(ownerId, period);

        return NextResponse.json({
          success: true,
          ownerId,
          period,
          metrics,
        });
      }

      case 'platform': {
        // Only admin can view platform-wide stats
        if (userRole !== 'admin') {
          return NextResponse.json({
            success: false,
            error: 'Unauthorized - Admin access required',
          }, { status: 403 });
        }

        const period = (searchParams.get('period') || 'monthly') as Period;
        const metrics = await calculatePlatformStats(period);

        return NextResponse.json({
          success: true,
          period,
          metrics,
        });
      }

      case 'compare': {
        const entityType = searchParams.get('entityType') as EntityType;
        const entityId = searchParams.get('entityId');
        const period = (searchParams.get('period') || 'monthly') as Period;

        if (!entityType) {
          return NextResponse.json({
            success: false,
            error: 'Entity type required',
          }, { status: 400 });
        }

        // Authorization check
        if (userRole === 'owner' && entityType === 'owner' && entityId !== userId) {
          return NextResponse.json({
            success: false,
            error: 'Unauthorized - Cannot view other owner stats',
          }, { status: 403 });
        }

        if (entityType === 'platform' && userRole !== 'admin') {
          return NextResponse.json({
            success: false,
            error: 'Unauthorized - Admin access required',
          }, { status: 403 });
        }

        const comparison = await comparePerformance(entityType, entityId || undefined, period);

        return NextResponse.json({
          success: true,
          entityType,
          entityId,
          period,
          comparison,
        });
      }

      case 'time-series': {
        const entityType = searchParams.get('entityType') as EntityType;
        const entityId = searchParams.get('entityId');
        const period = (searchParams.get('period') || 'monthly') as Period;
        const points = parseInt(searchParams.get('points') || '12');

        if (!entityType) {
          return NextResponse.json({
            success: false,
            error: 'Entity type required',
          }, { status: 400 });
        }

        // Authorization check
        if (userRole === 'owner' && entityType === 'owner' && entityId !== userId) {
          return NextResponse.json({
            success: false,
            error: 'Unauthorized - Cannot view other owner stats',
          }, { status: 403 });
        }

        if (entityType === 'platform' && userRole !== 'admin') {
          return NextResponse.json({
            success: false,
            error: 'Unauthorized - Admin access required',
          }, { status: 403 });
        }

        const timeSeries = await getTimeSeriesData(entityType, entityId || undefined, period, points);

        return NextResponse.json({
          success: true,
          entityType,
          entityId,
          period,
          points,
          timeSeries,
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
        }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Performance stats GET error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}

// ============================================
// POST - Calculate & Save Stats
// ============================================

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Please login',
      }, { status: 401 });
    }

    const userRole = session.user.role;
    const userId = session.user.id;

    // Only admin can save stats manually
    if (userRole !== 'admin') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin access required',
      }, { status: 403 });
    }

    const body = await request.json();
    const action = body.action || 'save';

    switch (action) {
      case 'save': {
        const data: CreateStatsData = {
          entityType: body.entityType,
          entityId: body.entityId,
          period: body.period,
          periodStart: body.periodStart,
          periodEnd: body.periodEnd,
          metrics: body.metrics,
          metadata: body.metadata,
        };

        const stats = await savePerformanceStats(data);

        return NextResponse.json({
          success: true,
          stats,
          message: 'Performance stats saved',
        }, { status: 201 });
      }

      case 'calculate-property': {
        const { propertyId, period } = body;
        if (!propertyId) {
          return NextResponse.json({
            success: false,
            error: 'Property ID required',
          }, { status: 400 });
        }

        const metrics = await calculatePropertyStats(propertyId, period || 'monthly');

        // Save calculated stats
        const { start, end } = await import('@/lib/performance-stats').then(m => m.getPeriodDates(period || 'monthly'));
        await savePerformanceStats({
          entityType: 'property',
          entityId: propertyId.toString(),
          period: period || 'monthly',
          periodStart: start,
          periodEnd: end,
          metrics,
        });

        return NextResponse.json({
          success: true,
          propertyId,
          period: period || 'monthly',
          metrics,
          message: 'Property stats calculated and saved',
        });
      }

      case 'calculate-owner': {
        const { ownerId, period } = body;
        if (!ownerId) {
          return NextResponse.json({
            success: false,
            error: 'Owner ID required',
          }, { status: 400 });
        }

        const metrics = await calculateOwnerStats(ownerId, period || 'monthly');

        // Save calculated stats
        const { start, end } = await import('@/lib/performance-stats').then(m => m.getPeriodDates(period || 'monthly'));
        await savePerformanceStats({
          entityType: 'owner',
          entityId: ownerId,
          period: period || 'monthly',
          periodStart: start,
          periodEnd: end,
          metrics,
        });

        return NextResponse.json({
          success: true,
          ownerId,
          period: period || 'monthly',
          metrics,
          message: 'Owner stats calculated and saved',
        });
      }

      case 'calculate-platform': {
        const { period } = body;

        const metrics = await calculatePlatformStats(period || 'monthly');

        // Save calculated stats
        const { start, end } = await import('@/lib/performance-stats').then(m => m.getPeriodDates(period || 'monthly'));
        await savePerformanceStats({
          entityType: 'platform',
          period: period || 'monthly',
          periodStart: start,
          periodEnd: end,
          metrics,
        });

        return NextResponse.json({
          success: true,
          period: period || 'monthly',
          metrics,
          message: 'Platform stats calculated and saved',
        });
      }

      case 'calculate-all': {
        const { period } = body;
        const selectedPeriod = (period || 'daily') as Period;

        // Calculate platform stats
        const platformMetrics = await calculatePlatformStats(selectedPeriod);
        const { start, end } = await import('@/lib/performance-stats').then(m => m.getPeriodDates(selectedPeriod));
        
        await savePerformanceStats({
          entityType: 'platform',
          period: selectedPeriod,
          periodStart: start,
          periodEnd: end,
          metrics: platformMetrics,
        });

        return NextResponse.json({
          success: true,
          period: selectedPeriod,
          message: 'All stats calculated and saved',
          calculated: {
            platform: true,
          },
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
        }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Performance stats POST error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}
