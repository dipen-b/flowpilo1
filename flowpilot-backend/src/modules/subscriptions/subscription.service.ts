import { Injectable } from '@nestjs/common';
import { PLAN_LIMITS, PlanType } from '@/config/plans';

interface UserSubscription {
  userId: string;
  plan: PlanType;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus: 'active' | 'trialing' | 'past_due' | 'cancelled' | 'none';
  trialEndsAt?: Date;
  subscriptionEndsAt?: Date;
  storageUsed: number;
}

interface SubscriptionEvent {
  userId: string;
  eventType: 'subscription_created' | 'upgraded' | 'downgraded' | 'cancelled' | 'trial_started' | 'trial_ended';
  oldPlan?: PlanType;
  newPlan?: PlanType;
  amountPaid?: number;
}

@Injectable()
export class SubscriptionService {
  createSubscription(
    userId: string,
    plan: PlanType,
    options: { stripeCustomerId?: string; stripeSubscriptionId?: string; trialDays?: number } = {}
  ): UserSubscription {
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

  async upgradePlan(userId: string, newPlan: PlanType, currentPlan: PlanType) {
    console.log(`📈 User ${userId} upgraded from ${currentPlan} to ${newPlan}`);
    return {
      userId,
      eventType: 'upgraded',
      oldPlan: currentPlan,
      newPlan,
    };
  }

  async downgradePlan(userId: string, newPlan: PlanType, currentPlan: PlanType) {
    console.log(`📉 User ${userId} downgraded from ${currentPlan} to ${newPlan}`);
    return {
      userId,
      eventType: 'downgraded',
      oldPlan: currentPlan,
      newPlan,
    };
  }

  async cancelSubscription(userId: string, plan: PlanType) {
    console.log(`❌ User ${userId} cancelled ${plan} subscription`);
    return {
      userId,
      eventType: 'cancelled',
      oldPlan: plan,
      newPlan: 'free',
    };
  }

  async startTrial(userId: string, trialDays: number = 14) {
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + trialDays);
    console.log(`🎁 User ${userId} started ${trialDays}-day trial`);
    return { event: { userId, eventType: 'trial_started', newPlan: 'pro' }, trialEndsAt };
  }

  isTrialExpired(trialEndsAt: Date): boolean {
    return new Date() > trialEndsAt;
  }

  getSubscriptionLimits(plan: PlanType) {
    return PLAN_LIMITS[plan];
  }

  async trackUsage(userId: string, usageType: string, amount: number = 1) {
    const monthYear = new Date().toISOString().slice(0, 7);
    console.log(`📊 Tracking ${usageType} for user ${userId} in ${monthYear}`);
    return { userId, monthYear, [usageType]: amount };
  }

  async updateStorageUsed(userId: string, bytes: number) {
    console.log(`💾 User ${userId} storage: ${Math.round(bytes / 1024 / 1024)}MB`);
    return { userId, storageUsed: bytes };
  }

  getSubscriptionStatus(subscription: UserSubscription) {
    return {
      plan: subscription.plan,
      status: subscription.subscriptionStatus,
      limits: this.getSubscriptionLimits(subscription.plan),
      storageUsed: subscription.storageUsed,
      storageLimit: PLAN_LIMITS[subscription.plan].maxStorage,
      trialEndsAt: subscription.trialEndsAt,
      subscriptionEndsAt: subscription.subscriptionEndsAt,
    };
  }
}
