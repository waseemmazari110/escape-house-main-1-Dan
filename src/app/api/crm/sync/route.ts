/**
 * API Route: /api/crm/sync
 * Sync membership status for user or all users
 * Milestone 5: CRM Sync
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  syncMembershipStatus,
  syncAllMemberships,
  getMembershipData,
  getMembershipSummary,
} from '@/lib/crm-sync';
import { nowUKFormatted } from '@/lib/date-utils';

/**
 * GET - Get membership data or summary
 */
export async function GET(request: NextRequest) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] GET /api/crm/sync`);

  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action'); // 'user' or 'summary'
    const userId = searchParams.get('userId') || session.user.id;

    if (action === 'summary') {
      // Admin only
      if (((session.user as any).role || 'guest') !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }

      const summary = await getMembershipSummary();
      return NextResponse.json({
        success: true,
        summary,
        timestamp: nowUKFormatted(),
      });
    }

    // Get user membership data
    const membershipData = await getMembershipData(userId);

    if (!membershipData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      membership: membershipData,
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error(`[${nowUKFormatted()}] Error fetching membership:`, (error as Error).message);
    return NextResponse.json(
      {
        error: 'Failed to fetch membership data',
        message: (error as Error).message,
        timestamp: nowUKFormatted(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Sync membership status
 */
export async function POST(request: NextRequest) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] POST /api/crm/sync`);

  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, userId } = body;

    if (action === 'sync-all') {
      // Admin only
      if (((session.user as any).role || 'guest') !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }

      const results = await syncAllMemberships();
      
      console.log(`[${nowUKFormatted()}] Synced all memberships: ${results.succeeded}/${results.total}`);

      return NextResponse.json({
        success: true,
        results,
        timestamp: nowUKFormatted(),
      });
    }

    // Sync single user
    const targetUserId = userId || session.user.id;

    // Only allow syncing own account unless admin
    if (targetUserId !== session.user.id && ((session.user as any).role || 'guest') !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const result = await syncMembershipStatus(targetUserId);

    console.log(`[${nowUKFormatted()}] Membership synced for user ${targetUserId}`);

    return NextResponse.json({
      success: true,
      result,
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error(`[${nowUKFormatted()}] Error syncing membership:`, (error as Error).message);
    return NextResponse.json(
      {
        error: 'Failed to sync membership',
        message: (error as Error).message,
        timestamp: nowUKFormatted(),
      },
      { status: 500 }
    );
  }
}
