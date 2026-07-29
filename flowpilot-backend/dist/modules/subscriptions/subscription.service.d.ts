import { PlanType } from '@/config/plans';
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
export declare class SubscriptionService {
    createSubscription(userId: string, plan: PlanType, options?: {
        stripeCustomerId?: string;
        stripeSubscriptionId?: string;
        trialDays?: number;
    }): UserSubscription;
    upgradePlan(userId: string, newPlan: PlanType, currentPlan: PlanType): Promise<{
        userId: string;
        eventType: string;
        oldPlan: "free" | "basic" | "pro" | "enterprise";
        newPlan: "free" | "basic" | "pro" | "enterprise";
    }>;
    downgradePlan(userId: string, newPlan: PlanType, currentPlan: PlanType): Promise<{
        userId: string;
        eventType: string;
        oldPlan: "free" | "basic" | "pro" | "enterprise";
        newPlan: "free" | "basic" | "pro" | "enterprise";
    }>;
    cancelSubscription(userId: string, plan: PlanType): Promise<{
        userId: string;
        eventType: string;
        oldPlan: "free" | "basic" | "pro" | "enterprise";
        newPlan: string;
    }>;
    startTrial(userId: string, trialDays?: number): Promise<{
        event: {
            userId: string;
            eventType: string;
            newPlan: string;
        };
        trialEndsAt: Date;
    }>;
    isTrialExpired(trialEndsAt: Date): boolean;
    getSubscriptionLimits(plan: PlanType): {
        name: string;
        pricePerUserMonth: number;
        pricePerUserYear: number;
        description: string;
        billingType: string;
        maxProjects: number;
        maxTeamMembers: number;
        maxStorage: number;
        maxActivityEntries: number;
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
        };
    } | {
        name: string;
        pricePerUserMonth: number;
        pricePerUserYear: number;
        description: string;
        billingType: string;
        minUsers: number;
        maxProjects: number;
        maxTeamMembers: number;
        maxStorage: number;
        maxActivityEntries: number;
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
        };
    } | {
        name: string;
        pricePerUserMonth: number;
        pricePerUserYear: number;
        description: string;
        billingType: string;
        minUsers: number;
        maxProjects: number;
        maxTeamMembers: number;
        maxStorage: number;
        maxActivityEntries: number;
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
        };
    } | {
        name: string;
        pricePerUserMonth: null;
        pricePerUserYear: null;
        description: string;
        billingType: string;
        maxProjects: number;
        maxTeamMembers: number;
        maxStorage: number;
        maxActivityEntries: number;
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
        };
    };
    trackUsage(userId: string, usageType: string, amount?: number): Promise<{
        [usageType]: number;
        userId: string;
        monthYear: string;
    }>;
    updateStorageUsed(userId: string, bytes: number): Promise<{
        userId: string;
        storageUsed: number;
    }>;
    getSubscriptionStatus(subscription: UserSubscription): {
        plan: "free" | "basic" | "pro" | "enterprise";
        status: "active" | "trialing" | "past_due" | "cancelled" | "none";
        limits: {
            name: string;
            pricePerUserMonth: number;
            pricePerUserYear: number;
            description: string;
            billingType: string;
            maxProjects: number;
            maxTeamMembers: number;
            maxStorage: number;
            maxActivityEntries: number;
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
            };
        } | {
            name: string;
            pricePerUserMonth: number;
            pricePerUserYear: number;
            description: string;
            billingType: string;
            minUsers: number;
            maxProjects: number;
            maxTeamMembers: number;
            maxStorage: number;
            maxActivityEntries: number;
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
            };
        } | {
            name: string;
            pricePerUserMonth: number;
            pricePerUserYear: number;
            description: string;
            billingType: string;
            minUsers: number;
            maxProjects: number;
            maxTeamMembers: number;
            maxStorage: number;
            maxActivityEntries: number;
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
            };
        } | {
            name: string;
            pricePerUserMonth: null;
            pricePerUserYear: null;
            description: string;
            billingType: string;
            maxProjects: number;
            maxTeamMembers: number;
            maxStorage: number;
            maxActivityEntries: number;
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
            };
        };
        storageUsed: number;
        storageLimit: number;
        trialEndsAt: Date | undefined;
        subscriptionEndsAt: Date | undefined;
    };
}
export {};
//# sourceMappingURL=subscription.service.d.ts.map