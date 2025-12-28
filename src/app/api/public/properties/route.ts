/**
 * MILESTONE 10: PUBLIC LISTINGS API
 * 
 * Public API endpoints for property listings
 * GET: Search, filter, and view properties
 * POST: Check availability (no auth required)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getPublicProperties,
  getPublicPropertyBySlug,
  getPublicPropertyById,
  getPropertyAvailability,
  checkAvailability,
  getPropertyReviews,
  getFeaturedProperties,
  searchProperties,
  getPropertiesByRegion,
  type PropertySearchFilters,
} from '@/lib/public-listings';

// ============================================
// GET - List/Search Properties
// ============================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'list';

    switch (action) {
      case 'list': {
        const filters: PropertySearchFilters = {};

        // Parse filters
        const search = searchParams.get('search');
        if (search) filters.search = search;

        const region = searchParams.get('region');
        if (region) {
          filters.region = region.includes(',') ? region.split(',') : region;
        }

        const location = searchParams.get('location');
        if (location) {
          filters.location = location.includes(',') ? location.split(',') : location;
        }

        const minPrice = searchParams.get('minPrice');
        if (minPrice) filters.minPrice = parseFloat(minPrice);

        const maxPrice = searchParams.get('maxPrice');
        if (maxPrice) filters.maxPrice = parseFloat(maxPrice);

        const minBedrooms = searchParams.get('minBedrooms');
        if (minBedrooms) filters.minBedrooms = parseInt(minBedrooms);

        const maxBedrooms = searchParams.get('maxBedrooms');
        if (maxBedrooms) filters.maxBedrooms = parseInt(maxBedrooms);

        const minGuests = searchParams.get('minGuests');
        if (minGuests) filters.minGuests = parseInt(minGuests);

        const maxGuests = searchParams.get('maxGuests');
        if (maxGuests) filters.maxGuests = parseInt(maxGuests);

        const features = searchParams.get('features');
        if (features) filters.features = features.split(',');

        const featured = searchParams.get('featured');
        if (featured) filters.featured = featured === 'true';

        const checkInDate = searchParams.get('checkInDate'); // DD/MM/YYYY
        if (checkInDate) filters.checkInDate = checkInDate;

        const checkOutDate = searchParams.get('checkOutDate'); // DD/MM/YYYY
        if (checkOutDate) filters.checkOutDate = checkOutDate;

        const sortBy = searchParams.get('sortBy') as PropertySearchFilters['sortBy'];
        if (sortBy) filters.sortBy = sortBy;

        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const result = await getPublicProperties(filters, limit, offset);

        return NextResponse.json({
          success: true,
          properties: result.properties,
          total: result.total,
          limit,
          offset,
          filters,
        });
      }

      case 'get': {
        const slug = searchParams.get('slug');
        const id = searchParams.get('id');

        if (!slug && !id) {
          return NextResponse.json({
            success: false,
            error: 'Property slug or id required',
          }, { status: 400 });
        }

        const property = slug
          ? await getPublicPropertyBySlug(slug)
          : await getPublicPropertyById(parseInt(id!));

        if (!property) {
          return NextResponse.json({
            success: false,
            error: 'Property not found',
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          property,
        });
      }

      case 'featured': {
        const limit = parseInt(searchParams.get('limit') || '6');
        const properties = await getFeaturedProperties(limit);

        return NextResponse.json({
          success: true,
          properties,
          total: properties.length,
        });
      }

      case 'search': {
        const q = searchParams.get('q');
        if (!q) {
          return NextResponse.json({
            success: false,
            error: 'Search query required',
          }, { status: 400 });
        }

        const limit = parseInt(searchParams.get('limit') || '20');
        const properties = await searchProperties(q, limit);

        return NextResponse.json({
          success: true,
          properties,
          total: properties.length,
          query: q,
        });
      }

      case 'by-region': {
        const region = searchParams.get('region');
        if (!region) {
          return NextResponse.json({
            success: false,
            error: 'Region required',
          }, { status: 400 });
        }

        const limit = parseInt(searchParams.get('limit') || '50');
        const properties = await getPropertiesByRegion(region, limit);

        return NextResponse.json({
          success: true,
          properties,
          total: properties.length,
          region,
        });
      }

      case 'availability': {
        const propertyId = searchParams.get('propertyId');
        const startDate = searchParams.get('startDate'); // DD/MM/YYYY
        const endDate = searchParams.get('endDate'); // DD/MM/YYYY

        if (!propertyId || !startDate || !endDate) {
          return NextResponse.json({
            success: false,
            error: 'Property ID, start date (DD/MM/YYYY), and end date (DD/MM/YYYY) required',
          }, { status: 400 });
        }

        try {
          const availability = await getPropertyAvailability(
            parseInt(propertyId),
            startDate,
            endDate
          );

          return NextResponse.json({
            success: true,
            propertyId: parseInt(propertyId),
            startDate,
            endDate,
            availability,
          });
        } catch (error: any) {
          return NextResponse.json({
            success: false,
            error: error.message,
          }, { status: 400 });
        }
      }

      case 'check-availability': {
        const propertyId = searchParams.get('propertyId');
        const checkInDate = searchParams.get('checkInDate'); // DD/MM/YYYY
        const checkOutDate = searchParams.get('checkOutDate'); // DD/MM/YYYY

        if (!propertyId || !checkInDate || !checkOutDate) {
          return NextResponse.json({
            success: false,
            error: 'Property ID, check-in date (DD/MM/YYYY), and check-out date (DD/MM/YYYY) required',
          }, { status: 400 });
        }

        try {
          const result = await checkAvailability(
            parseInt(propertyId),
            checkInDate,
            checkOutDate
          );

          return NextResponse.json({
            success: true,
            propertyId: parseInt(propertyId),
            checkInDate,
            checkOutDate,
            ...result,
          });
        } catch (error: any) {
          return NextResponse.json({
            success: false,
            error: error.message,
          }, { status: 400 });
        }
      }

      case 'reviews': {
        const propertyId = searchParams.get('propertyId');
        if (!propertyId) {
          return NextResponse.json({
            success: false,
            error: 'Property ID required',
          }, { status: 400 });
        }

        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const reviews = await getPropertyReviews(parseInt(propertyId), limit, offset);

        return NextResponse.json({
          success: true,
          propertyId: parseInt(propertyId),
          reviews,
          total: reviews.length,
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
        }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Public listings API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}

// ============================================
// POST - Check Availability (bulk)
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action || 'check-availability';

    switch (action) {
      case 'check-availability': {
        const { propertyIds, checkInDate, checkOutDate } = body;

        if (!propertyIds || !Array.isArray(propertyIds)) {
          return NextResponse.json({
            success: false,
            error: 'Property IDs array required',
          }, { status: 400 });
        }

        if (!checkInDate || !checkOutDate) {
          return NextResponse.json({
            success: false,
            error: 'Check-in date (DD/MM/YYYY) and check-out date (DD/MM/YYYY) required',
          }, { status: 400 });
        }

        const results = await Promise.all(
          propertyIds.map(async (propertyId: number) => {
            try {
              const result = await checkAvailability(propertyId, checkInDate, checkOutDate);
              return {
                propertyId,
                ...result,
              };
            } catch (error: any) {
              return {
                propertyId,
                available: false,
                error: error.message,
              };
            }
          })
        );

        const available = results.filter(r => r.available).map(r => r.propertyId);
        const unavailable = results.filter(r => !r.available).map(r => r.propertyId);

        return NextResponse.json({
          success: true,
          checkInDate,
          checkOutDate,
          results,
          summary: {
            total: propertyIds.length,
            available: available.length,
            unavailable: unavailable.length,
            availableProperties: available,
            unavailableProperties: unavailable,
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
    console.error('Public listings POST error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}
