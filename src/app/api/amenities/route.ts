/**
 * Amenities API
 * 
 * GET /api/amenities - List all available amenities
 * GET /api/amenities/property/[id] - Get property amenities
 * POST /api/amenities/property/[id] - Update property amenities
 * 
 * Milestone 8: Amenities, Pricing, Multi-Property
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  STANDARD_AMENITIES,
  getAmenitiesByCategory,
  getCategoriesWithCounts,
  getPremiumAmenities,
  searchAmenities,
  getPropertyAmenities,
  savePropertyAmenities,
  validateAmenityIds,
  type AmenityCategory,
} from '@/lib/amenities';
import { logAuditEvent } from '@/lib/audit-logger';

/**
 * GET /api/amenities
 * List all available amenities
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'list';

    if (action === 'list') {
      return await handleList(req);
    } else if (action === 'categories') {
      return await handleCategories(req);
    } else if (action === 'premium') {
      return await handlePremium(req);
    } else if (action === 'search') {
      return await handleSearch(req);
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: list, categories, premium, or search' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Amenities API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// LIST ALL AMENITIES
// ============================================

async function handleList(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') as AmenityCategory | null;

  let amenities;
  if (category) {
    amenities = getAmenitiesByCategory(category);
  } else {
    amenities = Object.values(STANDARD_AMENITIES);
  }

  return NextResponse.json({
    success: true,
    amenities,
    total: amenities.length,
  });
}

// ============================================
// GET CATEGORIES
// ============================================

async function handleCategories(req: NextRequest) {
  const categories = getCategoriesWithCounts();

  return NextResponse.json({
    success: true,
    categories,
  });
}

// ============================================
// GET PREMIUM AMENITIES
// ============================================

async function handlePremium(req: NextRequest) {
  const premiumAmenities = getPremiumAmenities();

  return NextResponse.json({
    success: true,
    amenities: premiumAmenities,
    total: premiumAmenities.length,
  });
}

// ============================================
// SEARCH AMENITIES
// ============================================

async function handleSearch(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { error: 'Missing required parameter: q' },
      { status: 400 }
    );
  }

  const results = searchAmenities(query);

  return NextResponse.json({
    success: true,
    query,
    results,
    total: results.length,
  });
}
