/**
 * Milestone 3 - Stripe Billing Test Suite
 * Test billing system functions with UK timestamps
 */

import { 
  createCustomer,
  createSubscription,
  cancelSubscription,
  reactivateSubscription,
  getUserSubscription,
  getUserInvoices,
  getActiveSubscriptionsCount,
  getTotalRevenue
} from '@/lib/stripe-billing';
import { nowUKFormatted } from '@/lib/date-utils';

async function testBillingSystem() {
  console.log('\n=== Stripe Billing System Test ===');
  console.log(`Started at: ${nowUKFormatted()}\n`);

  try {
    // Test 1: Create Customer
    console.log('Test 1: Creating Stripe customer...');
    const customer = await createCustomer({
      userId: 'test-user-001',
      email: 'test@example.com',
      name: 'Test User',
      phone: '+44 7700 900123',
      metadata: {
        source: 'test-suite',
        environment: 'development'
      }
    });
    console.log('✓ Customer created:', customer.id);

    // Test 2: Create Subscription
    console.log('\nTest 2: Creating subscription...');
    const subscriptionResult = await createSubscription({
      userId: 'test-user-001',
      customerId: customer.id,
      priceId: 'price_test_12345', // Replace with actual test price ID
      planName: 'Premium Plan',
      planType: 'monthly',
      trialDays: 14,
      metadata: {
        testRun: 'true'
      }
    });
    console.log('✓ Subscription created:', subscriptionResult.subscription.id);
    console.log('  Status:', subscriptionResult.subscription.status);
    console.log('  Trial ends:', subscriptionResult.subscription.trialEnd);

    // Test 3: Get User Subscription
    console.log('\nTest 3: Fetching user subscription...');
    const userSub = await getUserSubscription('test-user-001');
    if (userSub) {
      console.log('✓ Subscription found:');
      console.log('  Plan:', userSub.planName);
      console.log('  Status:', userSub.status);
      console.log('  Amount:', userSub.amount, userSub.currency);
    }

    // Test 4: Cancel Subscription (at period end)
    console.log('\nTest 4: Cancelling subscription at period end...');
    const cancelResult = await cancelSubscription(
      subscriptionResult.stripeSubscription.id,
      true
    );
    console.log('✓ Subscription marked for cancellation');
    console.log('  Will cancel at:', cancelResult.subscription.currentPeriodEnd);

    // Test 5: Reactivate Subscription
    console.log('\nTest 5: Reactivating subscription...');
    const reactivateResult = await reactivateSubscription(
      subscriptionResult.stripeSubscription.id
    );
    console.log('✓ Subscription reactivated');
    console.log('  Status:', reactivateResult.subscription.status);

    // Test 6: Get User Invoices
    console.log('\nTest 6: Fetching user invoices...');
    const invoices = await getUserInvoices('test-user-001');
    console.log(`✓ Found ${invoices.length} invoices`);
    invoices.forEach((inv, idx) => {
      console.log(`  Invoice ${idx + 1}: ${inv.invoiceNumber} - ${inv.status} - ${inv.total} ${inv.currency}`);
    });

    // Test 7: Get Statistics
    console.log('\nTest 7: Fetching statistics...');
    const activeCount = await getActiveSubscriptionsCount();
    const totalRevenue = await getTotalRevenue();
    console.log('✓ Statistics:');
    console.log('  Active subscriptions:', activeCount);
    console.log('  Total revenue: £', totalRevenue.toFixed(2));

    // Test 8: Cancel Immediately
    console.log('\nTest 8: Cancelling subscription immediately...');
    const immediateCancelResult = await cancelSubscription(
      subscriptionResult.stripeSubscription.id,
      false
    );
    console.log('✓ Subscription cancelled immediately');
    console.log('  Cancelled at:', immediateCancelResult.subscription.cancelledAt);

    console.log(`\n=== All Tests Completed ===`);
    console.log(`Finished at: ${nowUKFormatted()}`);

  } catch (error) {
    console.error('\n❌ Test failed:', (error as Error).message);
    console.error('Stack:', (error as Error).stack);
  }
}

// Run tests
testBillingSystem();
