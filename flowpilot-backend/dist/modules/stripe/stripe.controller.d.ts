import { StripeService } from './stripe.service';
export declare class StripeController {
    private readonly stripeService;
    constructor(stripeService: StripeService);
    createCheckoutSession(body: {
        planId: string;
        userId: string;
        email: string;
    }): Promise<{
        status: string;
        url: string;
        sessionId: string;
    }>;
    startTrial(body: {
        userId: string;
        email: string;
    }): Promise<{
        status: string;
        trialEndsAt: Date;
        message: string;
    }>;
    handleWebhook(event: any, signature: string): Promise<{
        received: boolean;
        result: {
            event: string;
            subscriptionId: any;
        } | {
            event: string;
            amount: any;
        } | {
            handled: boolean;
        };
    }>;
    cancelSubscription(body: {
        userId: string;
    }): Promise<{
        status: string;
        message: string;
        result: {
            userId: string;
            subscriptionId: string;
            cancelled: boolean;
            newPlan: string;
        };
    }>;
    upgradePlan(body: {
        userId: string;
        newPlan: string;
    }): Promise<{
        status: string;
        message: string;
        result: {
            userId: string;
            newPlan: string;
            effectiveDate: Date;
            priceId: string;
        };
    }>;
}
//# sourceMappingURL=stripe.controller.d.ts.map