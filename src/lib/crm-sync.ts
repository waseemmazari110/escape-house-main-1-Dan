/**
 * Milestone 5: CRM Sync - Membership Status Synchronization
 * Sync subscription status with user roles and CRM
 * All timestamps in DD/MM/YYYY HH:mm:ss UK time format
 */

import { db } from '@/db';
import { user, subscriptions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { nowUKFormatted } from '@/lib/date-utils';

// ============================================
// TYPES
// ============================================

export type MembershipStatus = 
  | 'free'           // No subscription
  | 'trial'          // In trial period
  | 'active'         // Active paid subscription
  | 'past_due'       // Payment failed, in retry
  | 'suspended'      // Account suspended
  | 'cancelled'      // Subscription cancelled
  | 'expired';       // Subscription expired

export type UserRole = 'guest' | 'owner' | 'admin';

export interface MembershipData {
  userId: string;
  status: MembershipStatus;
  role: UserRole;
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  planName: string | null;
  subscriptionId: string | null;
  
  // Dates
  subscriptionStart: string | null; // DD/MM/YYYY
  subscriptionEnd: string | null; // DD/MM/YYYY
  trialEnd: string | null; // DD/MM/YYYY
  
  // Limits
  maxProperties: number;
  maxPhotos: number;
  featuredListings: boolean;
  
  // Features
  hasAnalytics: boolean;
  hasPrioritySupport: boolean;
  hasApiAccess: boolean;
  hasCustomDomain: boolean;
  
  // Metadata
  lastSyncedAt: string; // DD/MM/YYYY HH:mm:ss
}

export interface CRMSyncResult {
  success: boolean;
  userId: string;
  previousStatus: MembershipStatus;
  newStatus: MembershipStatus;
  previousRole: UserRole;
  newRole: UserRole;
  changes: string[];
  syncedAt: string; // DD/MM/YYYY HH:mm:ss
}

// ============================================
// LOGGING
// ============================================

function logCRMSync(action: string, details?: any) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] CRM Sync: ${action}`, details || '');
}

// ============================================
// PLAN LIMITS
// ============================================

const PLAN_LIMITS = {
  free: {
    maxProperties: 1,
    maxPhotos: 10,
    featuredListings: false,
    hasAnalytics: false,
    hasPrioritySupport: false,
    hasApiAccess: false,
    hasCustomDomain: false,
  },
  basic: {
    maxProperties: 5,
    maxPhotos: 20,
    featuredListings: false,
    hasAnalytics: true,
    hasPrioritySupport: false,
    hasApiAccess: false,
    hasCustomDomain: false,
  },
  premium: {
    maxProperties: 25,
    maxPhotos: 50,
    featuredListings: true,
    hasAnalytics: true,
    hasPrioritySupport: true,
    hasApiAccess: false,
    hasCustomDomain: false,
  },
  enterprise: {
    maxProperties: -1, // unlimited
    maxPhotos: -1, // unlimited
    featuredListings: true,
    hasAnalytics: true,
    hasPrioritySupport: true,
    hasApiAccess: true,
    hasCustomDomain: true,
  },
};

// ============================================
// MEMBERSHIP STATUS FUNCTIONS
// ============================================

/**
 * Determine membership status from subscription
 */
function determineMembershipStatus(subscription: any): MembershipStatus {
  if (!subscription) {
    return 'free';
  }

  // Check trial
  if (subscription.trialEnd) {
    const trialEndParts = subscription.trialEnd.split('/');
    const trialEndDate = new Date(
      parseInt(trialEndParts[2]),
      parseInt(trialEndParts[1]) - 1,
      parseInt(trialEndParts[0])
    );
    const now = new Date();
    
    if (now < trialEndDate) {
      return 'trial';
    }
  }

  // Map subscription status
  switch (subscription.status) {
    case 'active':
      return 'active';
    case 'past_due':
      return 'past_due';
    case 'suspended':
      return 'suspended';
    case 'cancelled':
    case 'canceled':
      return 'cancelled';
    case 'incomplete':
    case 'incomplete_expired':
      return 'expired';
    default:
      return 'free';
  }
}

/**
 * Determine user role from membership status
 */
function determineUserRole(status: MembershipStatus, currentRole: UserRole): UserRole {
  // Admins always remain admins
  if (currentRole === 'admin') {
    return 'admin';
  }

  // Suspended or cancelled users become guests
  if (status === 'suspended' || status === 'cancelled' || status === 'expired') {
    return 'guest';
  }

  // Active, trial, or past_due users are owners
  if (status === 'active' || status === 'trial' || status === 'past_due') {
    return 'owner';
  }

  // Free users remain guests
  return 'guest';
}

/**
 * Extract tier from plan name
 */
function extractTier(planName: string | null): 'free' | 'basic' | 'premium' | 'enterprise' {
  if (!planName) return 'free';
  
  const lowerName = planName.toLowerCase();
  
  if (lowerName.includes('enterprise')) return 'enterprise';
  if (lowerName.includes('premium')) return 'premium';
  if (lowerName.includes('basic')) return 'basic';
  
  return 'free';
}

// ============================================
// SYNC FUNCTIONS
// ============================================

/**
 * Get current membership data for user
 */
export async function getMembershipData(userId: string): Promise<MembershipData | null> {
  try {
    logCRMSync('Fetching membership data', { userId });

    // Get user
    const [userData] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!userData) {
      logCRMSync('User not found', { userId });
      return null;
    }

    // Get subscription
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    const status = determineMembershipStatus(subscription);
    const role = userData.role as UserRole;
    const tier = subscription ? extractTier(subscription.planName) : 'free';
    const limits = PLAN_LIMITS[tier];

    const membershipData: MembershipData = {
      userId,
      status,
      role,
      tier,
      planName: subscription?.planName || null,
      subscriptionId: subscription?.id || null,
      
      subscriptionStart: subscription?.currentPeriodStart || null,
      subscriptionEnd: subscription?.currentPeriodEnd || null,
      trialEnd: subscription?.trialEnd || null,
      
      maxProperties: limits.maxProperties,
      maxPhotos: limits.maxPhotos,
      featuredListings: limits.featuredListings,
      
      hasAnalytics: limits.hasAnalytics,
      hasPrioritySupport: limits.hasPrioritySupport,
      hasApiAccess: limits.hasApiAccess,
      hasCustomDomain: limits.hasCustomDomain,
      
      lastSyncedAt: nowUKFormatted(),
    };

    logCRMSync('Membership data retrieved', {
      userId,
      status,
      tier,
    });

    return membershipData;

  } catch (error) {
    logCRMSync('Failed to get membership data', {
      userId,
      error: (error as Error).message,
    });
    return null;
  }
}

/**
 * Sync membership status for user
 */
export async function syncMembershipStatus(userId: string): Promise<CRMSyncResult> {
  try {
    logCRMSync('Starting membership sync', { userId });

    // Get current user data
    const [currentUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!currentUser) {
      throw new Error('User not found');
    }

    const previousRole = currentUser.role as UserRole;

    // Get subscription
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    // Determine new status
    const newStatus = determineMembershipStatus(subscription);
    const newRole = determineUserRole(newStatus, previousRole);

    // Track changes
    const changes: string[] = [];
    const previousStatus = subscription?.status as MembershipStatus || 'free';

    // Update user role if changed
    if (newRole !== previousRole) {
      await db
        .update(user)
        .set({ role: newRole })
        .where(eq(user.id, userId));

      changes.push(`Role updated: ${previousRole} → ${newRole}`);
    }

    // Log status change
    if (newStatus !== previousStatus) {
      changes.push(`Status updated: ${previousStatus} → ${newStatus}`);
    }

    const result: CRMSyncResult = {
      success: true,
      userId,
      previousStatus,
      newStatus,
      previousRole,
      newRole,
      changes,
      syncedAt: nowUKFormatted(),
    };

    logCRMSync('Membership sync completed', {
      userId,
      changes: changes.length,
    });

    return result;

  } catch (error) {
    logCRMSync('Membership sync failed', {
      userId,
      error: (error as Error).message,
    });

    throw error;
  }
}

/**
 * Sync all users' membership status
 */
export async function syncAllMemberships(): Promise<{
  total: number;
  succeeded: number;
  failed: number;
  results: CRMSyncResult[];
}> {
  try {
    logCRMSync('Starting bulk membership sync');

    const allUsers = await db.select().from(user);
    const results: CRMSyncResult[] = [];
    let succeeded = 0;
    let failed = 0;

    for (const userData of allUsers) {
      try {
        const result = await syncMembershipStatus(userData.id);
        results.push(result);
        succeeded++;
      } catch (error) {
        failed++;
        logCRMSync('Failed to sync user', {
          userId: userData.id,
          error: (error as Error).message,
        });
      }
    }

    logCRMSync('Bulk sync completed', {
      total: allUsers.length,
      succeeded,
      failed,
    });

    return {
      total: allUsers.length,
      succeeded,
      failed,
      results,
    };

  } catch (error) {
    logCRMSync('Bulk sync failed', {
      error: (error as Error).message,
    });
    throw error;
  }
}

/**
 * Update membership status after payment event
 */
export async function updateMembershipAfterPayment(
  userId: string,
  paymentSuccess: boolean
): Promise<CRMSyncResult> {
  try {
    logCRMSync('Updating membership after payment', {
      userId,
      paymentSuccess,
    });

    if (paymentSuccess) {
      // Payment succeeded - ensure user is owner with active status
      const [userData] = await db
        .select()
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

      const previousRole = userData?.role as UserRole;

      if (previousRole !== 'admin' && previousRole !== 'owner') {
        await db
          .update(user)
          .set({ role: 'owner' })
          .where(eq(user.id, userId));
      }
    }

    // Sync full membership status
    const result = await syncMembershipStatus(userId);

    logCRMSync('Membership updated after payment', {
      userId,
      newStatus: result.newStatus,
    });

    return result;

  } catch (error) {
    logCRMSync('Failed to update membership after payment', {
      userId,
      error: (error as Error).message,
    });
    throw error;
  }
}

/**
 * Downgrade user after subscription cancellation
 */
export async function downgradeAfterCancellation(userId: string): Promise<CRMSyncResult> {
  try {
    logCRMSync('Downgrading user after cancellation', { userId });

    // Update user role to guest
    await db
      .update(user)
      .set({ role: 'guest' })
      .where(eq(user.id, userId));

    // Sync membership status
    const result = await syncMembershipStatus(userId);

    logCRMSync('User downgraded after cancellation', {
      userId,
      newRole: result.newRole,
    });

    return result;

  } catch (error) {
    logCRMSync('Failed to downgrade user', {
      userId,
      error: (error as Error).message,
    });
    throw error;
  }
}

// ============================================
// FEATURE ACCESS CHECKS
// ============================================

/**
 * Check if user can access feature
 */
export async function canAccessFeature(
  userId: string,
  feature: keyof typeof PLAN_LIMITS.free
): Promise<boolean> {
  try {
    const membership = await getMembershipData(userId);
    if (!membership) return false;

    const limits = PLAN_LIMITS[membership.tier];
    return limits[feature] as boolean;

  } catch (error) {
    logCRMSync('Failed to check feature access', {
      userId,
      feature,
      error: (error as Error).message,
    });
    return false;
  }
}

/**
 * Check if user can add property
 */
export async function canAddProperty(userId: string, currentCount: number): Promise<boolean> {
  try {
    const membership = await getMembershipData(userId);
    if (!membership) return false;

    // Unlimited
    if (membership.maxProperties === -1) return true;

    return currentCount < membership.maxProperties;

  } catch (error) {
    logCRMSync('Failed to check property limit', {
      userId,
      error: (error as Error).message,
    });
    return false;
  }
}

/**
 * Get membership summary for dashboard
 */
export async function getMembershipSummary() {
  try {
    const allUsers = await db.select().from(user);
    const allSubscriptions = await db.select().from(subscriptions);

    const summary = {
      total: allUsers.length,
      byRole: {
        guest: allUsers.filter(u => u.role === 'guest').length,
        owner: allUsers.filter(u => u.role === 'owner').length,
        admin: allUsers.filter(u => u.role === 'admin').length,
      },
      byTier: {
        free: 0,
        basic: 0,
        premium: 0,
        enterprise: 0,
      },
      byStatus: {
        free: 0,
        trial: 0,
        active: 0,
        past_due: 0,
        suspended: 0,
        cancelled: 0,
        expired: 0,
      },
      generatedAt: nowUKFormatted(),
    };

    // Count by tier and status
    for (const sub of allSubscriptions) {
      const tier = extractTier(sub.planName);
      summary.byTier[tier]++;

      const status = determineMembershipStatus(sub);
      summary.byStatus[status]++;
    }

    // Count free users (no subscription)
    summary.byTier.free = allUsers.length - allSubscriptions.length;
    summary.byStatus.free = allUsers.length - allSubscriptions.length;

    return summary;

  } catch (error) {
    logCRMSync('Failed to get membership summary', {
      error: (error as Error).message,
    });
    return null;
  }
}
