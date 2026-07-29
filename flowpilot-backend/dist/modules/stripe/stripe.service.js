"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
let StripeService = class StripeService {
    /**
     * Create Stripe checkout session
     */
    async createCheckoutSession(data) {
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
    async startTrial(data) {
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
    async handleWebhook(event, signature) {
        console.log(`📨 Processing webhook: ${event.type}`);
        const webhookHandlers = {
            'customer.subscription.created': this.handleSubscriptionCreated.bind(this),
            'customer.subscription.updated': this.handleSubscriptionUpdated.bind(this),
            'customer.subscription.deleted': this.handleSubscriptionDeleted.bind(this),
            'invoice.payment_succeeded': this.handlePaymentSucceeded.bind(this),
            'invoice.payment_failed': this.handlePaymentFailed.bind(this),
        };
        const handler = webhookHandlers[event.type];
        if (handler) {
            return await handler(event.data.object);
        }
        console.log(`⚠️ Unknown webhook type: ${event.type}`);
        return { handled: false };
    }
    async handleSubscriptionCreated(subscription) {
        console.log(`✅ Subscription created: ${subscription.id}`);
        return { event: 'subscription_created', subscriptionId: subscription.id };
    }
    async handleSubscriptionUpdated(subscription) {
        console.log(`🔄 Subscription updated: ${subscription.id}`);
        return { event: 'subscription_updated', subscriptionId: subscription.id };
    }
    async handleSubscriptionDeleted(subscription) {
        console.log(`❌ Subscription deleted: ${subscription.id}`);
        // Update user plan to free
        return { event: 'subscription_deleted', subscriptionId: subscription.id, newPlan: 'free' };
    }
    async handlePaymentSucceeded(invoice) {
        console.log(`💰 Payment succeeded: ${invoice.id}`);
        return { event: 'payment_succeeded', amount: invoice.amount_paid };
    }
    async handlePaymentFailed(invoice) {
        console.log(`❌ Payment failed: ${invoice.id}`);
        return { event: 'payment_failed', amount: invoice.amount_due };
    }
    /**
     * Cancel user subscription
     */
    async cancelSubscription(userId) {
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
    async upgradePlan(userId, newPlan) {
        console.log(`📈 Upgrading user ${userId} to ${newPlan}`);
        return {
            userId,
            newPlan,
            effectiveDate: new Date(),
            priceId: 'price_1Abc123XYZ',
        };
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)()
], StripeService);
//# sourceMappingURL=stripe.service.js.map