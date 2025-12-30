/**
 * Media Management API
 * 
 * GET /api/media - List media with filters
 * GET /api/media/[id] - Get single media
 * PUT /api/media/[id] - Update media metadata
 * DELETE /api/media/[id] - Delete media
 * 
 * Milestone 7: Photo/Media Upload System
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  listMedia,
  getMediaById,
  updateMediaRecord,
  deleteMediaRecord,
  getMediaStats,
  getEntityMedia,
  searchMediaByTags,
} from '@/lib/media-storage';
import { logAuditEvent } from '@/lib/audit-logger';

/**
 * GET /api/media
 * List media with filters
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

    const { searchParams } = new URL(req.url);
    
    // Parse query parameters
    const fileType = searchParams.get('fileType') as 'image' | 'video' | 'document' | 'audio' | null;
    const folder = searchParams.get('folder');
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const userId = searchParams.get('userId'); // Admin can view any user's media
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    // Check if user wants their own media or has admin access
    const targetUserId = userId && session.user.role === 'admin' ? userId : session.user.id;

    // Handle different query types
    let mediaList;
    if (search) {
      // Search media
      const searchResults = await searchMediaByTags(search.split(',').map(t => t.trim()));
      mediaList = {
        media: searchResults,
        total: searchResults.length,
        limit,
        offset,
      };
    } else if (entityType && entityId) {
      // Get media by entity
      const entityMedia = await getEntityMedia(entityType, entityId);
      mediaList = {
        media: entityMedia,
        total: entityMedia.length,
        limit,
        offset,
      };
    } else {
      // List all media
      mediaList = await listMedia({
        filters: {
          uploadedBy: targetUserId,
          fileType,
          folder,
        },
        limit,
        offset,
        sortBy,
        sortOrder,
      });
    }

    // Get stats if requested
    const includeStats = searchParams.get('includeStats') === 'true';
    const stats = includeStats ? await getMediaStats(targetUserId) : undefined;

    return NextResponse.json({
      success: true,
      media: mediaList,
      stats,
      pagination: {
        limit,
        offset,
        hasMore: mediaList.length === limit,
      },
    });
  } catch (error: any) {
    console.error('Media list error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/media
 * Batch operations
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

    const body = await req.json();
    const { action } = body;

    if (action === 'stats') {
      const stats = await getMediaStats(session.user.id);
      return NextResponse.json({ success: true, stats });
    }

    if (action === 'batch-delete') {
      const { mediaIds } = body;
      if (!Array.isArray(mediaIds) || mediaIds.length === 0) {
        return NextResponse.json(
          { error: 'mediaIds array is required' },
          { status: 400 }
        );
      }

      // Delete each media
      const results = await Promise.allSettled(
        mediaIds.map(async (id: number) => {
          const media = await getMediaById(id);
          if (media && media.uploadedBy === session.user.id) {
            return await deleteMediaRecord(id, session.user.id);
          }
          throw new Error(`Media ${id} not found or unauthorized`);
        })
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      // Log audit event
      await logAuditEvent({
        userId: session.user.id,
        action: 'media.delete',
        entityType: 'media',
        entityId: 'batch',
        details: {
          mediaIds,
          successful,
          failed,
        },
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
      });

      return NextResponse.json({
        success: true,
        successful,
        failed,
        results: results.map((r, i) => ({
          mediaId: mediaIds[i],
          status: r.status,
          error: r.status === 'rejected' ? r.reason.message : undefined,
        })),
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Media batch operation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
