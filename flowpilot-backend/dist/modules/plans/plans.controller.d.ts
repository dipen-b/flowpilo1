import { PlansService, CheckFeatureResult } from './plans.service';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    /**
     * Get pricing information for all plans (per-user pricing)
     */
    getAllPlans(): {
        status: string;
        billingModel: string;
        data: {
            free: {
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
            basic: {
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
            pro: {
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
            enterprise: {
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
        };
    };
    /**
     * Get specific plan details
     */
    getPlan(plan: string): {
        status: string;
        message: string;
        data?: undefined;
    } | {
        status: string;
        data: {
            name: string;
            limits: {
                maxProjects: number;
                maxTeamMembers: number;
                maxStorage: number;
                maxActivityEntries: number;
            };
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
        };
        message?: undefined;
    };
    /**
     * Check feature availability for a plan
     */
    checkFeature(body: {
        plan: string;
        feature: string;
    }): {
        status: string;
        data: CheckFeatureResult;
    };
    /**
     * Check project creation limits
     */
    checkProjectLimit(body: {
        plan: string;
        currentProjectCount: number;
    }): {
        status: string;
        data: CheckFeatureResult;
    };
    /**
     * Check team member limits
     */
    checkMemberLimit(body: {
        plan: string;
        currentMemberCount: number;
    }): {
        status: string;
        data: CheckFeatureResult;
    };
    /**
     * Check storage limits
     */
    checkStorageLimit(body: {
        plan: string;
        currentUsage: number;
        fileSize: number;
    }): {
        status: string;
        data: CheckFeatureResult;
    };
    /**
     * Calculate pricing based on plan and team size
     */
    calculatePrice(body: {
        plan: string;
        userCount: number;
        billingPeriod: 'monthly' | 'annual';
    }): {
        status: string;
        data: any;
    };
}
//# sourceMappingURL=plans.controller.d.ts.map