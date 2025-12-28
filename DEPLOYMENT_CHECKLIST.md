# Production Deployment Checklist

**Project:** Escape Houses - Subscription & Owner Dashboard  
**Version:** 1.0  
**Date:** December 18, 2025  

---

## ✅ Pre-Deployment Checklist

### 1. Environment Variables

#### Required Variables
```env
# Database
□ DATABASE_URL=your_database_url

# Stripe (Production)
□ STRIPE_SECRET_KEY=sk_live_...
□ STRIPE_PUBLISHABLE_KEY=pk_live_...
□ STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (Production)
□ STRIPE_PRICE_BASIC_MONTHLY=price_...
□ STRIPE_PRICE_BASIC_YEARLY=price_...
□ STRIPE_PRICE_PREMIUM_MONTHLY=price_...
□ STRIPE_PRICE_PREMIUM_YEARLY=price_...
□ STRIPE_PRICE_ENTERPRISE_MONTHLY=price_...
□ STRIPE_PRICE_ENTERPRISE_YEARLY=price_...

# Application
□ NEXT_PUBLIC_APP_URL=https://escapehouses.co.uk
□ NODE_ENV=production

# Email (if using)
□ SMTP_HOST=your_smtp_host
□ SMTP_PORT=587
□ SMTP_USER=your_email
□ SMTP_PASS=your_password
□ SMTP_FROM=noreply@escapehouses.co.uk
```

### 2. Stripe Setup

#### Create Production Products & Prices
```
□ Create "Basic Monthly" product (£19.99/month)
□ Create "Basic Yearly" product (£199.99/year)
□ Create "Premium Monthly" product (£49.99/month)
□ Create "Premium Yearly" product (£499.99/year)
□ Create "Enterprise Monthly" product (£99.99/month)
□ Create "Enterprise Yearly" product (£999.99/year)
□ Save all price IDs to environment variables
```

#### Configure Webhook
```
□ Go to Stripe Dashboard → Developers → Webhooks
□ Add endpoint: https://escapehouses.co.uk/api/webhooks/billing
□ Select events:
  ✓ invoice.payment_succeeded
  ✓ invoice.payment_failed
  ✓ customer.subscription.updated
  ✓ customer.subscription.deleted
□ Copy webhook signing secret
□ Add to STRIPE_WEBHOOK_SECRET environment variable
```

#### Test Webhook
```
□ Use Stripe CLI to test webhook
□ Verify signature verification works
□ Check database updates correctly
□ Confirm email notifications send
```

### 3. Database Setup

#### Run Migrations
```bash
□ npm run drizzle:generate
□ npm run drizzle:migrate
```

#### Verify Tables Exist
```
□ subscriptions
□ invoices
□ properties
□ propertyImages
□ propertyFeatures
□ seasonalPricing
□ specialDatePricing
□ bookings
□ enquiries
□ user
□ session
```

#### Create Indexes
```sql
□ CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
□ CREATE INDEX idx_subscriptions_status ON subscriptions(status);
□ CREATE INDEX idx_properties_owner ON properties(owner_id);
□ CREATE INDEX idx_properties_status ON properties(status);
□ CREATE INDEX idx_invoices_user ON invoices(user_id);
```

### 4. Security

#### SSL/HTTPS
```
□ SSL certificate installed
□ HTTPS enforced
□ HTTP redirects to HTTPS
□ Secure cookies enabled
```

#### API Security
```
□ Rate limiting configured
□ CORS properly set
□ API authentication tested
□ Webhook signature verification working
```

#### Session Management
```
□ Session timeout configured
□ Secure session storage
□ CSRF protection enabled
```

### 5. Testing

#### Subscription Flow
```
□ Test free plan registration
□ Test subscription creation (all plans)
□ Test payment method update
□ Test subscription cancellation
□ Test reactivation flow
□ Test plan upgrades/downgrades
```

#### Payment Failure Flow
```
□ Test payment failure (using test card)
□ Verify email notifications sent
□ Check retry schedule (Day 3, 8, 15, 22)
□ Test auto-suspension (Day 29)
□ Test reactivation after suspension
```

#### Property Management
```
□ Test property creation
□ Test photo upload
□ Test feature management
□ Test pricing setup (base, seasonal, special)
□ Test property update
□ Test property deletion
□ Test property approval workflow
```

#### Analytics
```
□ Test dashboard stats calculation
□ Test revenue reporting
□ Test booking trends
□ Test property comparison
□ Test CSV export
```

#### API Endpoints
```
□ Test all subscription endpoints
□ Test all property endpoints
□ Test analytics endpoints
□ Test public endpoints
□ Test webhook endpoint
```

### 6. Email Configuration

#### SMTP Setup
```
□ SMTP credentials configured
□ Test email delivery
□ Verify email templates render correctly
□ Check spam score
```

#### Email Templates
```
□ Payment failure notifications
□ Suspension warnings
□ Reactivation confirmations
□ Renewal reminders
□ Welcome emails
□ Invoice emails
```

### 7. Monitoring

#### Error Tracking
```
□ Error logging configured
□ Error notifications set up
□ Error dashboard accessible
```

#### Performance Monitoring
```
□ API response time tracking
□ Database query monitoring
□ Webhook processing time tracking
□ Page load time monitoring
```

#### Alerts
```
□ Failed payment alerts
□ Webhook failure alerts
□ Database error alerts
□ High API error rate alerts
```

### 8. Documentation

#### Internal Docs
```
□ API documentation reviewed
□ Deployment guide created
□ Troubleshooting guide available
□ Runbook for common issues
```

#### User Docs
```
□ Owner quick start guide
□ Subscription management guide
□ Property listing guide
□ FAQ page
```

### 9. Backup & Recovery

#### Database Backups
```
□ Automated daily backups configured
□ Backup retention policy set (30 days)
□ Backup restoration tested
□ Off-site backup storage
```

#### Disaster Recovery
```
□ Recovery plan documented
□ Recovery time objective (RTO) defined
□ Recovery point objective (RPO) defined
□ Recovery procedures tested
```

### 10. Performance Optimization

#### Caching
```
□ API response caching configured
□ Static asset caching enabled
□ Database query caching set up
□ CDN configured for media
```

#### Database
```
□ Indexes created
□ Query optimization done
□ Connection pooling configured
□ Slow query logging enabled
```

#### Assets
```
□ Images optimized
□ Code minified
□ Gzip compression enabled
□ Lazy loading implemented
```

---

## 🚀 Deployment Steps

### 1. Pre-Deployment

```bash
# 1. Update dependencies
□ npm install

# 2. Run tests
□ npm test

# 3. Build application
□ npm run build

# 4. Test build locally
□ npm start

# 5. Verify all features work
□ Manual testing checklist
```

### 2. Database Migration

```bash
# 1. Backup current database
□ Create backup

# 2. Run migrations
□ npm run drizzle:migrate

# 3. Verify tables
□ Check all tables exist

# 4. Seed initial data (if needed)
□ npm run seed
```

### 3. Deploy Application

```bash
# 1. Deploy to hosting platform
□ Deploy code

# 2. Set environment variables
□ Configure all env vars

# 3. Start application
□ Start services

# 4. Health check
□ Verify app is running
```

### 4. Post-Deployment Verification

```bash
# 1. Test critical paths
□ Subscription creation
□ Property creation
□ Payment processing
□ Analytics loading

# 2. Monitor logs
□ Check for errors
□ Verify webhooks working

# 3. Test webhooks
□ Send test webhook from Stripe
□ Verify processing

# 4. Monitor performance
□ Check response times
□ Verify database performance
```

---

## 🎯 Go-Live Checklist

### Final Checks (Day of Launch)

```
Time: __________

□ All environment variables set correctly
□ Database backup completed
□ SSL certificate valid
□ DNS records correct
□ Email sending works
□ Stripe webhooks configured
□ Monitoring active
□ Error tracking enabled
□ Support team briefed
□ Documentation updated
□ Emergency contacts ready
```

### Launch Sequence

```
1. □ Final code review
2. □ Final testing in staging
3. □ Database backup
4. □ Deploy to production
5. □ Verify deployment successful
6. □ Test critical user flows
7. □ Monitor for 1 hour
8. □ Announce launch
```

### First 24 Hours Monitoring

```
Hour 1:
□ Monitor error rates
□ Check webhook processing
□ Verify payments working
□ Check database performance

Hour 6:
□ Review logs for issues
□ Check system health
□ Monitor user signups
□ Verify emails sending

Hour 24:
□ Generate health report
□ Review any issues
□ Plan fixes if needed
□ Update team
```

---

## 🆘 Rollback Plan

### When to Rollback

```
□ Critical bugs affecting payments
□ Database corruption
□ Security vulnerabilities
□ Performance issues affecting all users
□ Webhook processing failures
```

### Rollback Procedure

```
1. □ Stop new deployments
2. □ Notify team
3. □ Revert to previous version
4. □ Restore database if needed
5. □ Verify rollback successful
6. □ Monitor stability
7. □ Investigate root cause
8. □ Plan fix deployment
```

---

## 📊 Success Metrics

### Week 1 Targets

```
□ Zero critical bugs
□ 99.9% uptime
□ Payment success rate > 95%
□ Webhook success rate > 99%
□ API response time < 200ms
□ User signup rate tracking
□ Support ticket volume < 10/day
```

### Month 1 Targets

```
□ 99.9% uptime maintained
□ Payment success rate > 97%
□ User retention rate tracked
□ Revenue tracking active
□ Performance optimizations applied
□ User feedback collected
□ Feature requests documented
```

---

## 📞 Emergency Contacts

### Technical Team

```
Lead Developer: _______________
Phone: _______________
Email: _______________

DevOps: _______________
Phone: _______________
Email: _______________

Database Admin: _______________
Phone: _______________
Email: _______________
```

### External Services

```
Stripe Support: https://support.stripe.com
Phone: _______________

Hosting Provider: _______________
Support: _______________

Email Provider: _______________
Support: _______________
```

---

## 📝 Notes

### Known Issues

```
Issue 1: _______________
Workaround: _______________
Fix planned: _______________

Issue 2: _______________
Workaround: _______________
Fix planned: _______________
```

### Future Enhancements

```
Priority 1: _______________
Timeline: _______________

Priority 2: _______________
Timeline: _______________

Priority 3: _______________
Timeline: _______________
```

---

## ✅ Sign-Off

### Deployment Approval

```
Technical Lead: _______________ Date: _______________

Product Manager: _______________ Date: _______________

QA Lead: _______________ Date: _______________

DevOps: _______________ Date: _______________
```

### Post-Launch Review

```
Date: _______________
Issues encountered: _______________
Resolution time: _______________
Lessons learned: _______________
Next steps: _______________
```

---

**Status:** Ready for Production Deployment  
**Last Updated:** December 18, 2025  
**Version:** 1.0  

**Good luck with the launch! 🚀**
