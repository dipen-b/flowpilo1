export declare const PLAN_LIMITS: {
    free: {
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
    };
    basic: {
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
    };
    pro: {
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
    };
    enterprise: {
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
};
export declare const STRIPE_PRICES: {
    basic_monthly: string;
    basic_annual: string;
    pro_monthly: string;
    pro_annual: string;
};
export type PlanType = keyof typeof PLAN_LIMITS;
export type FeatureKey = keyof typeof PLAN_LIMITS.free.features;
//# sourceMappingURL=plans.d.ts.map