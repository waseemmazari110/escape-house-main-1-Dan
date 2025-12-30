/**
 * Media Item API
 * 
 * GET /api/media/[id] - Get single media
 * PUT /api/media/[id] - Update media metadata
 * DELETE /api/media/[id] - Delete media
 * 
 * Milestone 7: Photo/Media Upload System
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  getMediaById,
  updateMediaRecord,
  deleteMediaRecord,
} from '@/lib/media-storage';
import { logAuditEvent } from '@/lib/audit-logger';

/**
 * GET /api/media/[id]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const mediaId = parseInt(params.id);
    if (isNaN(mediaId)) {
      return NextResponse.json(
        { error: 'Invalid media ID' },
        { status: 400 }
      );
    }

    const media = await getMediaById(mediaId);

    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      );
    }

    // Check ownership (admin can view all)
    if (media.uploadedBy !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      media,
    });
  } catch (error: any) {
    console.error('Media get error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/media/[id]
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const mediaId = parseInt(params.id);
    if (isNaN(mediaId)) {
      return NextResponse.json(
        { error: 'Invalid media ID' },
        { status: 400 }
      );
    }

    // Get existing media
    const media = await getMediaById(mediaId);
    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (media.uploadedBy !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Parse update data
    const body = await req.json();
    const {
      title,
      altText,
      caption,
      description,
      tags,
      folder,
      isPublic,
      entityType,
      entityId,
    } = body;

    // Update media
    const updatedMedia = await updateMediaRecord(
      mediaId,
      {
        title,
        altText,
        caption,
        description,
        tags,
        folder,
        isPublic,
        entityType,
        entityId,
      },
      session.user.id
    );

    // Log audit event
    await logAuditEvent({
      userId: session.user.id,
      action: 'media.update',
      entityType: 'media',
      entityId: mediaId.toString(),
      details: {
        mediaId,
        fileName: media.fileName,
        updates: Object.keys(body),
      },
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json({
      success: true,
      media: updatedMedia,
    });
  } catch (error: any) {
    console.error('Media update error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/media/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const mediaId = parseInt(params.id);
    if (isNaN(mediaId)) {
      return NextResponse.json(
        { error: 'Invalid media ID' },
        { status: 400 }
      );
    }

    // Get existing media
    const media = await getMediaById(mediaId);
    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (media.uploadedBy !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Delete media
    await deleteMediaRecord(mediaId, session.user.id);

    // Log audit event
    await logAuditEvent({
      userId: session.user.id,
      action: 'media.delete',
      entityType: 'media',
      entityId: mediaId.toString(),
      details: {
        mediaId,
        fileName: media.fileName,
        fileSize: media.fileSize,
        fileType: media.fileType,
      },
      ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error: any) {
    console.error('Media delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
