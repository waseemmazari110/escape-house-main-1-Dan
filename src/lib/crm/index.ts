// CRM Integration - Main Entry Point
export * from './types';
export * from './base-service';
export * from './treadsoft-service';
export * from './factory';
export * from './sync-logger';

import { CRMServiceFactory } from './factory';

// Export convenience function to get CRM service instance
export const getCRMService = () => CRMServiceFactory.getInstance();
