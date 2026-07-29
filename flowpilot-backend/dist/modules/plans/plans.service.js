"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlansService = void 0;
const common_1 = require("@nestjs/common");
const plans_1 = require("../../config/plans");
let PlansService = class PlansService {
    /**
     * Check if a user has access to a specific feature
     */
    checkFeatureAccess(plan, feature) {
        const hasFeature = plans_1.PLAN_LIMITS[plan].features[feature];
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
    canCreateProject(userInfo) {
        const limit = plans_1.PLAN_LIMITS[userInfo.plan].maxProjects;
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
    canAddTeamMember(userInfo) {
        const limit = plans_1.PLAN_LIMITS[userInfo.plan].maxTeamMembers;
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
    canUploadFile(userInfo, fileSizeBytes) {
        const newUsage = userInfo.storageUsed + fileSizeBytes;
        const limit = plans_1.PLAN_LIMITS[userInfo.plan].maxStorage;
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
    getPlanFeatures(plan) {
        return plans_1.PLAN_LIMITS[plan].features;
    }
    /**
     * Get all limits for a plan
     */
    getPlanLimits(plan) {
        return {
            maxProjects: plans_1.PLAN_LIMITS[plan].maxProjects,
            maxTeamMembers: plans_1.PLAN_LIMITS[plan].maxTeamMembers,
            maxStorage: plans_1.PLAN_LIMITS[plan].maxStorage,
            maxActivityEntries: plans_1.PLAN_LIMITS[plan].maxActivityEntries
        };
    }
    /**
     * Check storage usage percentage
     */
    getStorageUsagePercent(userInfo) {
        const limit = plans_1.PLAN_LIMITS[userInfo.plan].maxStorage;
        if (limit === Infinity)
            return 0;
        return (userInfo.storageUsed / limit) * 100;
    }
    /**
     * Calculate monthly price based on plan and user count
     */
    calculateMonthlyPrice(plan, userCount) {
        const planConfig = plans_1.PLAN_LIMITS[plan];
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
    calculateAnnualPrice(plan, userCount) {
        const planConfig = plans_1.PLAN_LIMITS[plan];
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
    getPlanPricingInfo(plan) {
        const planConfig = plans_1.PLAN_LIMITS[plan];
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
    getAnnualDiscount(plan) {
        const planConfig = plans_1.PLAN_LIMITS[plan];
        if (plan === 'free' || planConfig.pricePerUserMonth === null) {
            return 0;
        }
        const monthlyAnnual = planConfig.pricePerUserMonth * 12;
        const actualAnnual = planConfig.pricePerUserYear;
        if (monthlyAnnual === 0)
            return 0;
        return Math.round(((monthlyAnnual - actualAnnual) / monthlyAnnual) * 100);
    }
    /**
     * Format bytes to human readable format
     */
    formatBytes(bytes) {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }
};
exports.PlansService = PlansService;
exports.PlansService = PlansService = __decorate([
    (0, common_1.Injectable)()
], PlansService);
//# sourceMappingURL=plans.service.js.map