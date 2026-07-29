interface CheckoutSessionRequest {
    planId: string;
    userId: string;
    email: string;
}
interface TrialRequest {
    userId: string;
    email: string;
}
export declare class StripeService {
    /**
     * Create Stripe checkout session
     */
    createCheckoutSession(data: CheckoutSessionRequest): Promise<{
        id: string;
        url: string;
        priceId: string;
        customerId: string;
    }>;
    /**
     * Start free trial for user
     */
    startTrial(data: TrialRequest): Promise<{
        subscriptionId: string;
        status: string;
        trialEndsAt: Date;
        plan: string;
    }>;
    /**
     * Handle Stripe webhooks
     */
    handleWebhook(event: any, signature: string): Promise<{
        event: string;
        subscriptionId: any;
    } | {
        event: string;
        amount: any;
    } | {
        handled: boolean;
    }>;
    private handleSubscriptionCreated;
    private handleSubscriptionUpdated;
    private handleSubscriptionDeleted;
    private handlePaymentSucceeded;
    private handlePaymentFailed;
    /**
     * Cancel user subscription
     */
    cancelSubscription(userId: string): Promise<{
        userId: string;
        subscriptionId: string;
        cancelled: boolean;
        newPlan: string;
    }>;
    /**
     * Upgrade user plan
     */
    upgradePlan(userId: string, newPlan: string): Promise<{
        userId: string;
        newPlan: string;
        effectiveDate: Date;
        priceId: string;
    }>;
}
export {};
//# sourceMappingURL=stripe.service.d.ts.map