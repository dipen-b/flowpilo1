"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const plans_1 = require("../../config/plans");
let SubscriptionService = class SubscriptionService {
    createSubscription(userId, plan, options = {}) {
        const now = new Date();
        const trialEndsAt = options.trialDays
            ? new Date(now.getTime() + options.trialDays * 24 * 60 * 60 * 1000)
            : undefined;
        return {
            userId,
            plan,
            stripeCustomerId: options.stripeCustomerId,
            stripeSubscriptionId: options.stripeSubscriptionId,
            subscriptionStatus: options.trialDays ? 'trialing' : 'active',
            trialEndsAt,
            storageUsed: 0,
        };
    }
    async upgradePlan(userId, newPlan, currentPlan) {
        console.log(`📈 User ${userId} upgraded from ${currentPlan} to ${newPlan}`);
        return {
            userId,
            eventType: 'upgraded',
            oldPlan: currentPlan,
            newPlan,
        };
    }
    async downgradePlan(userId, newPlan, currentPlan) {
        console.log(`📉 User ${userId} downgraded from ${currentPlan} to ${newPlan}`);
        return {
            userId,
            eventType: 'downgraded',
            oldPlan: currentPlan,
            newPlan,
        };
    }
    async cancelSubscription(userId, plan) {
        console.log(`❌ User ${userId} cancelled ${plan} subscription`);
        return {
            userId,
            eventType: 'cancelled',
            oldPlan: plan,
            newPlan: 'free',
        };
    }
    async startTrial(userId, trialDays = 14) {
        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + trialDays);
        console.log(`🎁 User ${userId} started ${trialDays}-day trial`);
        return { event: { userId, eventType: 'trial_started', newPlan: 'pro' }, trialEndsAt };
    }
    isTrialExpired(trialEndsAt) {
        return new Date() > trialEndsAt;
    }
    getSubscriptionLimits(plan) {
        return plans_1.PLAN_LIMITS[plan];
    }
    async trackUsage(userId, usageType, amount = 1) {
        const monthYear = new Date().toISOString().slice(0, 7);
        console.log(`📊 Tracking ${usageType} for user ${userId} in ${monthYear}`);
        return { userId, monthYear, [usageType]: amount };
    }
    async updateStorageUsed(userId, bytes) {
        console.log(`💾 User ${userId} storage: ${Math.round(bytes / 1024 / 1024)}MB`);
        return { userId, storageUsed: bytes };
    }
    getSubscriptionStatus(subscription) {
        return {
            plan: subscription.plan,
            status: subscription.subscriptionStatus,
            limits: this.getSubscriptionLimits(subscription.plan),
            storageUsed: subscription.storageUsed,
            storageLimit: plans_1.PLAN_LIMITS[subscription.plan].maxStorage,
            trialEndsAt: subscription.trialEndsAt,
            subscriptionEndsAt: subscription.subscriptionEndsAt,
        };
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, common_1.Injectable)()
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map