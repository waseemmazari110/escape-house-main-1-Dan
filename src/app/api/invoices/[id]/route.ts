/**
 * API Route: /api/invoices/[id]
 * Get invoice details and generate HTML
 * Milestone 5: Invoices + Receipts
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateInvoiceData, generateInvoiceHTML } from '@/lib/invoice-receipt';
import { nowUKFormatted } from '@/lib/date-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] GET /api/invoices/${id}`);

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

    // Generate invoice data
    const invoiceData = await generateInvoiceData(id);

    if (!invoiceData) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Verify user owns this invoice
    if (invoiceData.customerId !== session.user.id && (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Return HTML if requested
    if (format === 'html') {
      const html = generateInvoiceHTML(invoiceData);
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }

    // Return JSON data
    return NextResponse.json({
      success: true,
      invoice: invoiceData,
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error(`[${nowUKFormatted()}] Error fetching invoice:`, (error as Error).message);
    return NextResponse.json(
      {
        error: 'Failed to fetch invoice',
        message: (error as Error).message,
        timestamp: nowUKFormatted(),
      },
      { status: 500 }
    );
  }
}
