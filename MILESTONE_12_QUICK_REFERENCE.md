# Milestone 12 — Quick Reference Guide

**Monitoring, Logging & Error Handling Essentials**  
**Date Format**: DD/MM/YYYY HH:MM:SS (UK Standard)  
**Last Updated**: 12/12/2025

---

## 🚀 Quick Logger Usage

### Basic Logging

```typescript
import { logger } from '@/lib/logger';

// Info logging
logger.info('context', 'Message here');

// Error logging
logger.error('context', 'Error message', { additionalData: 'value' });

// Warning
logger.warn('context', 'Warning message');

// Debug (development only)
logger.debug('context', 'Debug info');

// Fatal error
logger.fatal('context', 'Critical error');
```

### Context-Specific Logging

```typescript
// Payment logging
logger.payment('succeeded', 'Payment completed', { 
  amount: 150.00, 
  bookingId: 'book_123' 
});

// Auth logging
logger.auth('login', 'User logged in', 'user_123');

// Database logging
logger.database('query', 'Fetched properties', { count: 25 });

// API logging
logger.api('POST', '/api/bookings', 201, 145, 'user_123', 'req_xyz');
```

---

## ⚠️ Error Throwing

### Quick Error Examples

```typescript
import { 
  ValidationError, 
  AuthenticationError, 
  NotFoundError,
  PaymentError 
} from '@/lib/errors';

// Validation error
throw new ValidationError('Invalid email format');

// Authentication required
throw new AuthenticationError('Please log in');

// Resource not found
throw new NotFoundError('Property');

// Payment failed
throw new PaymentError('Card declined', { code: 'card_declined' });
```

### All Error Types

```typescript
ValidationError       // 400 - Bad Request
AuthenticationError   // 401 - Unauthorized
AuthorizationError    // 403 - Forbidden
NotFoundError        // 404 - Not Found
ConflictError        // 409 - Conflict
PaymentError         // 402 - Payment Required
RateLimitError       // 429 - Too Many Requests
DatabaseError        // 500 - Internal Server Error
ExternalServiceError // 503 - Service Unavailable
```

---

## 🔧 API Route Template

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withApiLogger } from '@/middleware/api-logger';
import { handleError } from '@/lib/errors/handler';
import { logger } from '@/lib/logger';

async function handler(req: NextRequest) {
  try {
    logger.info('context', 'Operation starting');
    
    // Your logic here
    const result = await doSomething();
    
    logger.info('context', 'Operation completed');
    return NextResponse.json({ result });
  } catch (error) {
    return handleError(error);
  }
}

export const GET = withApiLogger(handler);
export const POST = withApiLogger(handler);
```

---

## 📊 Database Monitoring

```typescript
import { dbMonitor } from '@/lib/monitoring/database';

// Track any database query
const result = await dbMonitor.trackQuery(
  'operationName',
  () => db.table.findMany(),
  { additionalContext: 'value' }
);
```

---

## 🏥 Health Check Usage

```typescript
// GET /api/health

// Response:
{
  "status": "healthy" | "degraded" | "unhealthy",
  "timestamp": "14/02/2025 18:20:31",
  "services": {
    "database": { "status": "up", "responseTime": 25 },
    "cache": { "status": "up", "responseTime": 5 },
    "storage": { "status": "up", "responseTime": 10 }
  },
  "uptime": 3600000,
  "memory": {
    "used": 512,
    "total": 1024,
    "percentage": 50
  }
}
```

---

## 🚨 Alert System

```typescript
import { alertSystem, AlertSeverity } from '@/lib/alerts';

// Send alert
await alertSystem.sendAlert({
  severity: AlertSeverity.CRITICAL,
  title: 'High Error Rate',
  message: 'Error rate exceeded 5%',
  data: { errorRate: 6.5, endpoint: '/api/payments' }
});

// Check thresholds
alertSystem.checkErrorRate(6.5, '/api/payments');
alertSystem.checkResponseTime(3500, '/api/search');
alertSystem.checkMemoryUsage(85);
```

---

## 📝 Log Format Examples

```
// Standard log
14/02/2025 18:20:31 [INFO] [context] Message

// With user
14/02/2025 18:20:31 [INFO] [context] Message | User: user_123

// With request ID
14/02/2025 18:20:31 [INFO] [context] Message | Request: req_xyz

// With both
14/02/2025 18:20:31 [INFO] [context] Message | User: user_123 | Request: req_xyz

// With data
14/02/2025 18:20:31 [INFO] [context] Message {"key":"value"} | User: user_123
```

---

## 🎯 Common Logging Patterns

### Payment Processing

```typescript
logger.info('billing', 'Payment processing started', { bookingId, amount });
// ... process payment
logger.payment('succeeded', 'Payment completed', { bookingId, amount, paymentId });
```

### Authentication

```typescript
logger.auth('login-attempt', `Login attempt for ${email}`);
// ... verify credentials
logger.auth('login-success', `User logged in`, userId);
```

### Booking Creation

```typescript
logger.info('booking', 'Creating booking', { propertyId, userId });
// ... create booking
logger.info('booking', 'Booking created', { bookingId, propertyId });
```

### API Errors

```typescript
try {
  // operation
} catch (error: any) {
  logger.error('context', 'Operation failed', { 
    error: error.message,
    stack: error.stack 
  });
  throw error;
}
```

---

## 🔍 UK Date/Time Formatter

```typescript
// Format current timestamp
function formatTimestampUK(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
```

---

## 📈 Performance Monitoring

```typescript
import { performanceMonitor } from '@/lib/monitoring/performance';

// Track request performance
performanceMonitor.trackRequest('POST', '/api/bookings', 145, true);

// Get metrics
const metrics = performanceMonitor.getMetrics();
```

---

## 🛡️ Error Response Format

```typescript
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "statusCode": 400,
    "timestamp": "14/02/2025 18:20:31",
    "requestId": "req_xyz789",
    "data": { /* optional additional data */ }
  }
}
```

---

## 🔧 Environment Variables

```bash
# Logging
NODE_ENV=production

# Alerts
ADMIN_EMAIL=admin@escapehouses.co.uk
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@escapehouses.co.uk
SMTP_PASS=your-app-password

# Monitoring
LOG_LEVEL=INFO
SLOW_QUERY_THRESHOLD=1000
```

---

## 📊 Log Contexts

Common context values to use:

- `auth` - Authentication events
- `billing` - Payment processing
- `booking` - Booking operations
- `property` - Property management
- `user` - User operations
- `database` - Database queries
- `api` - API requests
- `email` - Email sending
- `cache` - Cache operations
- `health` - Health checks
- `performance` - Performance metrics
- `alerts` - Alert system
- `maintenance` - System maintenance

---

## 🚀 Complete Example

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withApiLogger } from '@/middleware/api-logger';
import { handleError } from '@/lib/errors/handler';
import { ValidationError, NotFoundError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { dbMonitor } from '@/lib/monitoring/database';

async function handler(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      throw new AuthenticationError();
    }

    const body = await req.json();
    
    logger.info('booking', 'Creating booking', {
      userId: session.userId,
      propertyId: body.propertyId,
    });

    // Validate
    if (!body.propertyId) {
      throw new ValidationError('Property ID required');
    }

    // Check property exists
    const property = await dbMonitor.trackQuery(
      'getProperty',
      () => db.property.findUnique({ where: { id: body.propertyId } })
    );

    if (!property) {
      throw new NotFoundError('Property');
    }

    // Create booking
    const booking = await dbMonitor.trackQuery(
      'createBooking',
      () => db.booking.create({ data: { ...body, guestId: session.userId } })
    );

    logger.info('booking', 'Booking created successfully', {
      bookingId: booking.id,
      userId: session.userId,
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export const POST = withApiLogger(handler);
```

---

## 📋 Quick Checklist

**Before Deployment:**
- [ ] All logs use UK date format
- [ ] Appropriate log levels set
- [ ] Sensitive data not logged
- [ ] Error handlers in place
- [ ] Health check endpoint working
- [ ] Alert system configured
- [ ] Log rotation enabled
- [ ] Performance monitoring active
- [ ] Database queries tracked
- [ ] Admin email configured

---

## 🔗 Quick Links

- Full Documentation: `MILESTONE_12_COMPLETE.md`
- Health Check: `GET /api/health`
- Log Viewer: `GET /api/admin/logs`
- Log Directory: `/logs`

---

**Quick Reference Version**: 1.0.0  
**Last Updated**: 12/12/2025  
**Log Format**: DD/MM/YYYY HH:MM:SS (UK Standard)
