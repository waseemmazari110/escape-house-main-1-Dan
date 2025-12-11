/**
 * Database Helpers for Milestone 2 Tables
 * All timestamps use UK format: DD/MM/YYYY HH:mm:ss
 */

import { db } from '@/db';
import { subscriptions, invoices, media, enquiries } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nowUKFormatted, todayUKFormatted } from '@/lib/date-utils';

// ============================================
// SUBSCRIPTIONS HELPERS
// ============================================

export interface CreateSubscriptionData {
  userId: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCustomerId?: string;
  planName: string;
  planType: string;
  currentPeriodStart: string; // DD/MM/YYYY
  currentPeriodEnd: string; // DD/MM/YYYY
  amount: number;
  currency?: string;
  interval: string;
  intervalCount?: number;
  status?: string;
  metadata?: Record<string, any>;
}

export async function createSubscription(data: CreateSubscriptionData) {
  const now = nowUKFormatted();
  
  return await db.insert(subscriptions).values({
    ...data,
    currency: data.currency || 'GBP',
    status: data.status || 'active',
    intervalCount: data.intervalCount || 1,
    cancelAtPeriodEnd: false,
    metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    createdAt: now,
    updatedAt: now,
  }).returning();
}

export async function updateSubscription(id: number, data: Partial<CreateSubscriptionData>) {
  const now = nowUKFormatted();
  
  return await db.update(subscriptions)
    .set({
      ...data,
      metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      updatedAt: now,
    })
    .where(eq(subscriptions.id, id))
    .returning();
}

export async function cancelSubscription(id: number, cancelAtPeriodEnd: boolean = true) {
  const now = nowUKFormatted();
  
  return await db.update(subscriptions)
    .set({
      cancelAtPeriodEnd,
      cancelledAt: cancelAtPeriodEnd ? null : now,
      status: cancelAtPeriodEnd ? 'active' : 'cancelled',
      updatedAt: now,
    })
    .where(eq(subscriptions.id, id))
    .returning();
}

export async function getUserSubscriptions(userId: string) {
  return await db.select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId));
}

// ============================================
// INVOICES HELPERS
// ============================================

export interface CreateInvoiceData {
  userId: string;
  subscriptionId?: number;
  stripeInvoiceId?: string;
  stripePaymentIntentId?: string;
  invoiceNumber: string;
  description?: string;
  amountDue: number;
  subtotal: number;
  total: number;
  currency?: string;
  taxAmount?: number;
  invoiceDate: string; // DD/MM/YYYY
  dueDate?: string; // DD/MM/YYYY
  periodStart?: string; // DD/MM/YYYY
  periodEnd?: string; // DD/MM/YYYY
  billingReason?: string;
  customerEmail: string;
  customerName: string;
  status?: string;
  metadata?: Record<string, any>;
}

export async function createInvoice(data: CreateInvoiceData) {
  const now = nowUKFormatted();
  
  return await db.insert(invoices).values({
    ...data,
    currency: data.currency || 'GBP',
    status: data.status || 'draft',
    amountPaid: 0,
    amountRemaining: data.amountDue,
    taxAmount: data.taxAmount || 0,
    metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    createdAt: now,
    updatedAt: now,
  }).returning();
}

export async function markInvoicePaid(id: number, paymentDetails?: {
  stripePaymentIntentId?: string;
  amountPaid: number;
}) {
  const now = nowUKFormatted();
  
  return await db.update(invoices)
    .set({
      status: 'paid',
      paidAt: now,
      amountPaid: paymentDetails?.amountPaid,
      amountRemaining: 0,
      stripePaymentIntentId: paymentDetails?.stripePaymentIntentId,
      updatedAt: now,
    })
    .where(eq(invoices.id, id))
    .returning();
}

export async function getUserInvoices(userId: string) {
  return await db.select()
    .from(invoices)
    .where(eq(invoices.userId, userId));
}

export async function getInvoiceByNumber(invoiceNumber: string) {
  return await db.select()
    .from(invoices)
    .where(eq(invoices.invoiceNumber, invoiceNumber))
    .limit(1);
}

// ============================================
// MEDIA HELPERS
// ============================================

export interface CreateMediaData {
  fileName: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'document' | 'audio';
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  duration?: number;
  altText?: string;
  caption?: string;
  description?: string;
  title?: string;
  entityType?: string;
  entityId?: string;
  uploadedBy?: string;
  folder?: string;
  tags?: string[];
  isPublic?: boolean;
  thumbnailUrl?: string;
  metadata?: Record<string, any>;
  storageProvider?: string;
  storageKey?: string;
}

export async function createMedia(data: CreateMediaData) {
  const now = nowUKFormatted();
  
  return await db.insert(media).values({
    ...data,
    folder: data.folder || 'general',
    isPublic: data.isPublic !== false,
    storageProvider: data.storageProvider || 'supabase',
    tags: data.tags ? JSON.stringify(data.tags) : null,
    metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    createdAt: now,
    updatedAt: now,
  }).returning();
}

export async function updateMedia(id: number, data: Partial<CreateMediaData>) {
  const now = nowUKFormatted();
  
  return await db.update(media)
    .set({
      ...data,
      tags: data.tags ? JSON.stringify(data.tags) : undefined,
      metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      updatedAt: now,
    })
    .where(eq(media.id, id))
    .returning();
}

export async function getMediaByEntity(entityType: string, entityId: string) {
  return await db.select()
    .from(media)
    .where(eq(media.entityType, entityType))
    .where(eq(media.entityId, entityId));
}

export async function deleteMedia(id: number) {
  return await db.delete(media)
    .where(eq(media.id, id))
    .returning();
}

// ============================================
// ENQUIRIES HELPERS
// ============================================

export interface CreateEnquiryData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  enquiryType?: string;
  source?: string;
  propertyId?: number;
  checkInDate?: string; // DD/MM/YYYY
  checkOutDate?: string; // DD/MM/YYYY
  numberOfGuests?: number;
  occasion?: string;
  budget?: number;
  preferredLocations?: string[];
  specialRequests?: string;
  referralSource?: string;
  marketingConsent?: boolean;
  ipAddress?: string;
  userAgent?: string;
  priority?: string;
  metadata?: Record<string, any>;
}

export async function createEnquiry(data: CreateEnquiryData) {
  const now = nowUKFormatted();
  
  return await db.insert(enquiries).values({
    ...data,
    enquiryType: data.enquiryType || 'general',
    source: data.source || 'website',
    status: 'new',
    priority: data.priority || 'medium',
    marketingConsent: data.marketingConsent || false,
    preferredLocations: data.preferredLocations ? JSON.stringify(data.preferredLocations) : null,
    metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    createdAt: now,
    updatedAt: now,
  }).returning();
}

export async function updateEnquiryStatus(
  id: number, 
  status: 'new' | 'in_progress' | 'resolved' | 'closed' | 'spam',
  assignedTo?: string
) {
  const now = nowUKFormatted();
  
  return await db.update(enquiries)
    .set({
      status,
      assignedTo,
      updatedAt: now,
    })
    .where(eq(enquiries.id, id))
    .returning();
}

export async function respondToEnquiry(id: number, respondedBy: string, notes?: string) {
  const now = nowUKFormatted();
  
  return await db.update(enquiries)
    .set({
      respondedAt: now,
      respondedBy,
      adminNotes: notes,
      status: 'in_progress',
      updatedAt: now,
    })
    .where(eq(enquiries.id, id))
    .returning();
}

export async function resolveEnquiry(id: number, internalNotes?: string) {
  const now = nowUKFormatted();
  
  return await db.update(enquiries)
    .set({
      status: 'resolved',
      resolvedAt: now,
      internalNotes,
      updatedAt: now,
    })
    .where(eq(enquiries.id, id))
    .returning();
}

export async function getEnquiriesByStatus(status: string) {
  return await db.select()
    .from(enquiries)
    .where(eq(enquiries.status, status));
}

export async function getEnquiriesByType(enquiryType: string) {
  return await db.select()
    .from(enquiries)
    .where(eq(enquiries.enquiryType, enquiryType));
}
