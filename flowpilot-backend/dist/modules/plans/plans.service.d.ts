import { PlanType, FeatureKey } from '@/config/plans';
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
export declare class PlansService {
    /**
     * Check if a user has access to a specific feature
     */
    checkFeatureAccess(plan: PlanType, feature: FeatureKey): CheckFeatureResult;
    /**
     * Check if user can create more projects
     */
    canCreateProject(userInfo: UserPlanInfo): CheckFeatureResult;
    /**
     * Check if user can add more team members
     */
    canAddTeamMember(userInfo: UserPlanInfo): CheckFeatureResult;
    /**
     * Check if user can upload a file (storage check)
     */
    canUploadFile(userInfo: UserPlanInfo, fileSizeBytes: number): CheckFeatureResult;
    /**
     * Get all features for a plan
     */
    getPlanFeatures(plan: PlanType): {
        ganttChart: boolean;
        advancedReports: boolean;
        slackIntegration: boolean;
        customWorkflows: boolean;
        desktopNotifications: boolean;
        emailDigests: boolean;
        sso: boolean;
        apiAccess: boolean;
        agentPlatform: boolean;
        linearAgent: boolean;
    } | {
        ganttChart: boolean;
        advancedReports: boolean;
        slackIntegration: boolean;
        customWorkflows: boolean;
        desktopNotifications: boolean;
        emailDigests: boolean;
        sso: boolean;
        apiAccess: boolean;
        agentPlatform: boolean;
        linearAgent: boolean;
    } | {
        ganttChart: boolean;
        advancedReports: boolean;
        slackIntegration: boolean;
        customWorkflows: boolean;
        desktopNotifications: boolean;
        emailDigests: boolean;
        sso: boolean;
        apiAccess: boolean;
        agentPlatform: boolean;
        linearAgent: boolean;
    } | {
        ganttChart: boolean;
        advancedReports: boolean;
        slackIntegration: boolean;
        customWorkflows: boolean;
        desktopNotifications: boolean;
        emailDigests: boolean;
        sso: boolean;
        apiAccess: boolean;
        agentPlatform: boolean;
        linearAgent: boolean;
    };
    /**
     * Get all limits for a plan
     */
    getPlanLimits(plan: PlanType): {
        maxProjects: number;
        maxTeamMembers: number;
        maxStorage: number;
        maxActivityEntries: number;
    };
    /**
     * Check storage usage percentage
     */
    getStorageUsagePercent(userInfo: UserPlanInfo): number;
    /**
     * Calculate monthly price based on plan and user count
     */
    calculateMonthlyPrice(plan: PlanType, userCount: number): number | null;
    /**
     * Calculate annual price based on plan and user count
     */
    calculateAnnualPrice(plan: PlanType, userCount: number): number | null;
    /**
     * Get pricing information for a plan
     */
    getPlanPricingInfo(plan: PlanType): {
        name: string;
        description: string;
        billingType: string;
        pricePerUserMonth: number | null;
        pricePerUserYear: number | null;
        features: {
            ganttChart: boolean;
            advancedReports: boolean;
            slackIntegration: boolean;
            customWorkflows: boolean;
            desktopNotifications: boolean;
            emailDigests: boolean;
            sso: boolean;
            apiAccess: boolean;
            agentPlatform: boolean;
            linearAgent: boolean;
        } | {
            ganttChart: boolean;
            advancedReports: boolean;
            slackIntegration: boolean;
            customWorkflows: boolean;
            desktopNotifications: boolean;
            emailDigests: boolean;
            sso: boolean;
            apiAccess: boolean;
            agentPlatform: boolean;
            linearAgent: boolean;
        } | {
            ganttChart: boolean;
            advancedReports: boolean;
            slackIntegration: boolean;
            customWorkflows: boolean;
            desktopNotifications: boolean;
            emailDigests: boolean;
            sso: boolean;
            apiAccess: boolean;
            agentPlatform: boolean;
            linearAgent: boolean;
        } | {
            ganttChart: boolean;
            advancedReports: boolean;
            slackIntegration: boolean;
            customWorkflows: boolean;
            desktopNotifications: boolean;
            emailDigests: boolean;
            sso: boolean;
            apiAccess: boolean;
            agentPlatform: boolean;
            linearAgent: boolean;
        };
        limits: {
            maxProjects: number;
            maxTeamMembers: number;
            maxStorage: number;
            maxActivityEntries: number;
        };
    };
    /**
     * Calculate discount percentage for annual billing
     */
    getAnnualDiscount(plan: PlanType): number;
    /**
     * Format bytes to human readable format
     */
    private formatBytes;
}
//# sourceMappingURL=plans.service.d.ts.map