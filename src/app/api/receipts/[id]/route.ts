/**
 * API Route: /api/receipts/[id]
 * Generate receipt for paid invoice
 * Milestone 5: Invoices + Receipts
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateReceiptData, generateReceiptHTML } from '@/lib/invoice-receipt';
import { nowUKFormatted } from '@/lib/date-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] GET /api/receipts/${id}`);

  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format'); // 'json' or 'html'

    // Generate receipt data
    const receiptData = await generateReceiptData(id);

    if (!receiptData) {
      return NextResponse.json(
        { error: 'Receipt not available. Invoice must be paid.' },
        { status: 404 }
      );
    }

    // Verify user owns this receipt
    if (receiptData.customerId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Return HTML if requested
    if (format === 'html') {
      const html = generateReceiptHTML(receiptData);
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }

    // Return JSON data
    return NextResponse.json({
      success: true,
      receipt: receiptData,
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error(`[${nowUKFormatted()}] Error generating receipt:`, (error as Error).message);
    return NextResponse.json(
      {
        error: 'Failed to generate receipt',
        message: (error as Error).message,
        timestamp: nowUKFormatted(),
      },
      { status: 500 }
    );
  }
}
