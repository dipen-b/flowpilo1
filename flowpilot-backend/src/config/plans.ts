// Per-user/month pricing model (like Linear)
export const PLAN_LIMITS = {
  free: {
    name: 'Free',
    pricePerUserMonth: 0,
    pricePerUserYear: 0,
    description: 'Free for everyone',
    billingType: 'flat', // No per-user billing
    maxProjects: 5,
    maxTeamMembers: Infinity, // Unlimited in free tier
    maxStorage: 500 * 1024 * 1024, // 500MB
    maxActivityEntries: 100,
    features: {
      ganttChart: false,
      advancedReports: false,
      slackIntegration: false,
      customWorkflows: false,
      desktopNotifications: true,
      emailDigests: false,
      sso: false,
      apiAccess: false,
      agentPlatform: true,
      linearAgent: true,
    }
  },
  basic: {
    name: 'Basic',
    pricePerUserMonth: 10,
    pricePerUserYear: 100, // ~17% discount for annual
    description: 'For growing teams',
    billingType: 'per-user',
    minUsers: 1,
    maxProjects: Infinity,
    maxTeamMembers: Infinity,
    maxStorage: 10 * 1024 * 1024 * 1024, // 10GB
    maxActivityEntries: 10000,
    features: {
      ganttChart: true,
      advancedReports: false,
      slackIntegration: true,
      customWorkflows: true,
      desktopNotifications: true,
      emailDigests: true,
      sso: false,
      apiAccess: true,
      agentPlatform: true,
      linearAgent: true,
    }
  },
  pro: {
    name: 'Business',
    pricePerUserMonth: 16,
    pricePerUserYear: 160, // ~20% discount for annual
    description: 'For established teams',
    billingType: 'per-user',
    minUsers: 1,
    maxProjects: Infinity,
    maxTeamMembers: Infinity,
    maxStorage: 50 * 1024 * 1024 * 1024, // 50GB
    maxActivityEntries: Infinity,
    features: {
      ganttChart: true,
      advancedReports: true,
      slackIntegration: true,
      customWorkflows: true,
      desktopNotifications: true,
      emailDigests: true,
      sso: false,
      apiAccess: true,
      agentPlatform: true,
      linearAgent: true,
    }
  },
  enterprise: {
    name: 'Enterprise',
    pricePerUserMonth: null, // Custom pricing
    pricePerUserYear: null,
    description: 'Custom for large organizations',
    billingType: 'custom',
    maxProjects: Infinity,
    maxTeamMembers: Infinity,
    maxStorage: Infinity,
    maxActivityEntries: Infinity,
    features: {
      ganttChart: true,
      advancedReports: true,
      slackIntegration: true,
      customWorkflows: true,
      desktopNotifications: true,
      emailDigests: true,
      sso: true,
      apiAccess: true,
      agentPlatform: true,
      linearAgent: true,
    }
  }
};

export const STRIPE_PRICES = {
  // Per-user pricing (cents per month)
  basic_monthly: 'price_1Abc123XYZ', // $10/user/month
  basic_annual: 'price_1Abc124XYZ',  // $100/user/year
  pro_monthly: 'price_1Abc125XYZ',   // $16/user/month
  pro_annual: 'price_1Abc126XYZ',    // $160/user/year
};

export type PlanType = keyof typeof PLAN_LIMITS;
export type FeatureKey = keyof typeof PLAN_LIMITS.free.features;
