import { Injectable } from '@nestjs/common';

interface CheckoutSessionRequest {
  planId: string;
  userId: string;
  email: string;
}

interface TrialRequest {
  userId: string;
  email: string;
}

@Injectable()
export class StripeService {
  /**
   * Create Stripe checkout session
   */
  async createCheckoutSession(data: CheckoutSessionRequest) {
    const prices = {
      pro_monthly: 'price_1Abc123XYZ',
      pro_annual: 'price_1Abc456XYZ',
    };

    const priceId = data.planId === 'pro' ? prices.pro_monthly : null;

    if (!priceId) {
      throw new Error(`Invalid plan: ${data.planId}`);
    }

    console.log(`💳 Creating checkout session for ${data.email} (${data.planId})`);

    // Mock Stripe session response
    return {
      id: `cs_${Date.now()}`,
      url: `https://checkout.stripe.com/pay/${priceId}`,
      priceId,
      customerId: `cus_${data.userId}`,
    };
  }

  /**
   * Start free trial for user
   */
  async startTrial(data: TrialRequest) {
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    console.log(`🎁 Trial starts for ${data.email}, ends on ${trialEndsAt.toDateString()}`);

    return {
      subscriptionId: `sub_trial_${Date.now()}`,
      status: 'trialing',
      trialEndsAt,
      plan: 'pro',
    };
  }

  /**
   * Handle Stripe webhooks
   */
  async handleWebhook(event: any, signature: string) {
    console.log(`📨 Processing webhook: ${event.type}`);

    const webhookHandlers = {
      'customer.subscription.created': this.handleSubscriptionCreated.bind(this),
      'customer.subscription.updated': this.handleSubscriptionUpdated.bind(this),
      'customer.subscription.deleted': this.handleSubscriptionDeleted.bind(this),
      'invoice.payment_succeeded': this.handlePaymentSucceeded.bind(this),
      'invoice.payment_failed': this.handlePaymentFailed.bind(this),
    };

    const handler = webhookHandlers[event.type as keyof typeof webhookHandlers];
    
    if (handler) {
      return await handler(event.data.object);
    }

    console.log(`⚠️ Unknown webhook type: ${event.type}`);
    return { handled: false };
  }

  private async handleSubscriptionCreated(subscription: any) {
    console.log(`✅ Subscription created: ${subscription.id}`);
    return { event: 'subscription_created', subscriptionId: subscription.id };
  }

  private async handleSubscriptionUpdated(subscription: any) {
    console.log(`🔄 Subscription updated: ${subscription.id}`);
    return { event: 'subscription_updated', subscriptionId: subscription.id };
  }

  private async handleSubscriptionDeleted(subscription: any) {
    console.log(`❌ Subscription deleted: ${subscription.id}`);
    // Update user plan to free
    return { event: 'subscription_deleted', subscriptionId: subscription.id, newPlan: 'free' };
  }

  private async handlePaymentSucceeded(invoice: any) {
    console.log(`💰 Payment succeeded: ${invoice.id}`);
    return { event: 'payment_succeeded', amount: invoice.amount_paid };
  }

  private async handlePaymentFailed(invoice: any) {
    console.log(`❌ Payment failed: ${invoice.id}`);
    return { event: 'payment_failed', amount: invoice.amount_due };
  }

  /**
   * Cancel user subscription
   */
  async cancelSubscription(userId: string) {
    console.log(`❌ Cancelling subscription for user ${userId}`);

    return {
      userId,
      subscriptionId: `sub_${userId}`,
      cancelled: true,
      newPlan: 'free',
    };
  }

  /**
   * Upgrade user plan
   */
  async upgradePlan(userId: string, newPlan: string) {
    console.log(`📈 Upgrading user ${userId} to ${newPlan}`);

    return {
      userId,
      newPlan,
      effectiveDate: new Date(),
      priceId: 'price_1Abc123XYZ',
    };
  }
}
