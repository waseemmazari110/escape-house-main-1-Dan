// CRM Sync Logger
// Tracks all CRM synchronization operations

import { db } from '@/db';
import { crmSyncLogs } from '@/db/schema';
import { CRMSyncLog } from './types';

export class CRMSyncLogger {
  static async log(logEntry: Omit<CRMSyncLog, 'id' | 'createdAt'>): Promise<void> {
    try {
      await db.insert(crmSyncLogs).values({
        entityType: logEntry.entityType,
        entityId: logEntry.entityId,
        crmId: logEntry.crmId,
        action: logEntry.action,
        status: logEntry.status,
        requestData: logEntry.request ? JSON.stringify(logEntry.request) : null,
        responseData: logEntry.response ? JSON.stringify(logEntry.response) : null,
        errorMessage: logEntry.error,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to log CRM sync operation:', error);
    }
  }

  static async logSuccess(
    entityType: CRMSyncLog['entityType'],
    entityId: string,
    crmId: string,
    action: CRMSyncLog['action'],
    request?: any,
    response?: any
  ): Promise<void> {
    await this.log({
      entityType,
      entityId,
      crmId,
      action,
      status: 'success',
      request,
      response,
    });
  }

  static async logFailure(
    entityType: CRMSyncLog['entityType'],
    entityId: string,
    action: CRMSyncLog['action'],
    error: string,
    request?: any
  ): Promise<void> {
    await this.log({
      entityType,
      entityId,
      action,
      status: 'failed',
      error,
      request,
    });
  }

  static async logPending(
    entityType: CRMSyncLog['entityType'],
    entityId: string,
    action: CRMSyncLog['action']
  ): Promise<void> {
    await this.log({
      entityType,
      entityId,
      action,
      status: 'pending',
    });
  }

  static async getRecentLogs(limit: number = 50): Promise<any[]> {
    try {
      const logs = await db
        .select()
        .from(crmSyncLogs)
        .orderBy(crmSyncLogs.createdAt)
        .limit(limit);
      
      return logs;
    } catch (error) {
      console.error('Failed to fetch CRM sync logs:', error);
      return [];
    }
  }

  static async getLogsByEntity(
    entityType: CRMSyncLog['entityType'],
    entityId: string
  ): Promise<any[]> {
    try {
      const { eq, and } = await import('drizzle-orm');
      
      const logs = await db
        .select()
        .from(crmSyncLogs)
        .where(
          and(
            eq(crmSyncLogs.entityType, entityType),
            eq(crmSyncLogs.entityId, entityId)
          )
        )
        .orderBy(crmSyncLogs.createdAt);
      
      return logs;
    } catch (error) {
      console.error('Failed to fetch entity CRM sync logs:', error);
      return [];
    }
  }
}
