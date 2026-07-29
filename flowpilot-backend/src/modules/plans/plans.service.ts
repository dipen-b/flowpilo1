import { Injectable } from '@nestjs/common';
import { PLAN_LIMITS, PlanType, FeatureKey } from '@/config/plans';

export interface UserPlanInfo {
  userId: string;
  plan: PlanType;
  storageUsed: number;
  projectCount: number;
  teamMemberCount: number;
}

export interface CheckFeatureResult {
  allowed: boolean;
  message?: string;
  upgradeUrl?: string;
  currentValue?: number;
  limit?: number;
}

@Injectable()
export class PlansService {
  /**
   * Check if a user has access to a specific feature
   */
  checkFeatureAccess(plan: PlanType, feature: FeatureKey): CheckFeatureResult {
    const hasFeature = PLAN_LIMITS[plan].features[feature];

    if (!hasFeature) {
      return {
        allowed: false,
        message: `This feature is only available on the Pro plan`,
        upgradeUrl: '/pricing'
      };
    }

    return { allowed: true };
  }

  /**
   * Check if user can create more projects
   */
  canCreateProject(userInfo: UserPlanInfo): CheckFeatureResult {
    const limit = PLAN_LIMITS[userInfo.plan].maxProjects;

    if (userInfo.projectCount >= limit) {
      return {
        allowed: false,
        message: `You've reached the limit of ${limit} projects for the ${userInfo.plan} plan`,
        currentValue: userInfo.projectCount,
        limit: limit,
        upgradeUrl: '/pricing'
      };
    }

    return { allowed: true };
  }

  /**
   * Check if user can add more team members
   */
  canAddTeamMember(userInfo: UserPlanInfo): CheckFeatureResult {
    const limit = PLAN_LIMITS[userInfo.plan].maxTeamMembers;

    if (userInfo.teamMemberCount >= limit) {
      return {
        allowed: false,
        message: `You've reached the limit of ${limit} team members for the ${userInfo.plan} plan`,
        currentValue: userInfo.teamMemberCount,
        limit: limit,
        upgradeUrl: '/pricing'
      };
    }

    return { allowed: true };
  }

  /**
   * Check if user can upload a file (storage check)
   */
  canUploadFile(userInfo: UserPlanInfo, fileSizeBytes: number): CheckFeatureResult {
    const newUsage = userInfo.storageUsed + fileSizeBytes;
    const limit = PLAN_LIMITS[userInfo.plan].maxStorage;

    if (newUsage > limit) {
      return {
        allowed: false,
        message: `Storage limit exceeded. Current: ${this.formatBytes(userInfo.storageUsed)} / Limit: ${this.formatBytes(limit)}`,
        currentValue: userInfo.storageUsed,
        limit: limit,
        upgradeUrl: '/pricing'
      };
    }

    // Warn if over 80% usage
    const percentUsed = (newUsage / limit) * 100;
    if (percentUsed > 80) {
      return {
        allowed: true,
        message: `Storage is ${Math.round(percentUsed)}% full. Consider upgrading to Pro for 10GB.`
      };
    }

    return { allowed: true };
  }

  /**
   * Get all features for a plan
   */
  getPlanFeatures(plan: PlanType) {
    return PLAN_LIMITS[plan].features;
  }

  /**
   * Get all limits for a plan
   */
  getPlanLimits(plan: PlanType) {
    return {
      maxProjects: PLAN_LIMITS[plan].maxProjects,
      maxTeamMembers: PLAN_LIMITS[plan].maxTeamMembers,
      maxStorage: PLAN_LIMITS[plan].maxStorage,
      maxActivityEntries: PLAN_LIMITS[plan].maxActivityEntries
    };
  }

  /**
   * Check storage usage percentage
   */
  getStorageUsagePercent(userInfo: UserPlanInfo): number {
    const limit = PLAN_LIMITS[userInfo.plan].maxStorage;
    if (limit === Infinity) return 0;
    return (userInfo.storageUsed / limit) * 100;
  }

  /**
   * Calculate monthly price based on plan and user count
   */
  calculateMonthlyPrice(plan: PlanType, userCount: number): number | null {
    const planConfig = PLAN_LIMITS[plan];

    if (plan === 'free' || planConfig.pricePerUserMonth === 0) {
      return 0;
    }

    if (planConfig.pricePerUserMonth === null) {
      return null; // Custom pricing
    }

    return planConfig.pricePerUserMonth * userCount;
  }

  /**
   * Calculate annual price based on plan and user count
   */
  calculateAnnualPrice(plan: PlanType, userCount: number): number | null {
    const planConfig = PLAN_LIMITS[plan];

    if (plan === 'free' || planConfig.pricePerUserYear === 0) {
      return 0;
    }

    if (planConfig.pricePerUserYear === null) {
      return null; // Custom pricing
    }

    return planConfig.pricePerUserYear * userCount;
  }

  /**
   * Get pricing information for a plan
   */
  getPlanPricingInfo(plan: PlanType) {
    const planConfig = PLAN_LIMITS[plan];

    return {
      name: planConfig.name,
      description: planConfig.description,
      billingType: planConfig.billingType,
      pricePerUserMonth: planConfig.pricePerUserMonth,
      pricePerUserYear: planConfig.pricePerUserYear,
      features: planConfig.features,
      limits: {
        maxProjects: planConfig.maxProjects,
        maxTeamMembers: planConfig.maxTeamMembers,
        maxStorage: planConfig.maxStorage,
        maxActivityEntries: planConfig.maxActivityEntries
      }
    };
  }

  /**
   * Calculate discount percentage for annual billing
   */
  getAnnualDiscount(plan: PlanType): number {
    const planConfig = PLAN_LIMITS[plan];

    if (plan === 'free' || planConfig.pricePerUserMonth === null) {
      return 0;
    }

    const monthlyAnnual = planConfig.pricePerUserMonth * 12;
    const actualAnnual = planConfig.pricePerUserYear;

    if (monthlyAnnual === 0) return 0;

    return Math.round(((monthlyAnnual - actualAnnual) / monthlyAnnual) * 100);
  }

  /**
   * Format bytes to human readable format
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
