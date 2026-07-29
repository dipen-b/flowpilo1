interface MockPaymentRequest {
    plan: 'basic' | 'pro' | 'enterprise';
    userCount: number;
    billingPeriod: 'monthly' | 'annual';
    cardNumber?: string;
}
interface MockPaymentResponse {
    status: 'success' | 'error';
    transactionId?: string;
    message?: string;
    subscription?: {
        plan: string;
        status: string;
        amount: number;
        period: string;
        nextBillingDate: string;
    };
}
export declare class PaymentsController {
    /**
     * Mock payment processing endpoint
     * Simulates payment without actually charging
     */
    processPayment(body: MockPaymentRequest): Promise<MockPaymentResponse>;
    /**
     * Mock checkout session creation
     * Returns a checkout page URL (in real app, this would be Stripe)
     */
    createCheckout(body: MockPaymentRequest): Promise<{
        checkoutUrl: string;
        sessionId: string;
    }>;
    /**
     * Verify payment status
     */
    verifyPayment(body: {
        transactionId: string;
    }): Promise<{
        status: string;
        verified: boolean;
    }>;
}
export {};
//# sourceMappingURL=payments.controller.d.ts.map