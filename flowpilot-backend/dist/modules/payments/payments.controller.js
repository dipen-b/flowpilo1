"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
let PaymentsController = class PaymentsController {
    /**
     * Mock payment processing endpoint
     * Simulates payment without actually charging
     */
    async processPayment(body) {
        const { plan, userCount, billingPeriod, cardNumber = '4242 4242 4242 4242' } = body;
        // Validate payment amount
        const planPrices = {
            basic: 10,
            pro: 16,
            enterprise: 0, // Custom pricing
        };
        const pricePerUser = planPrices[plan];
        const monthlyAmount = pricePerUser * userCount;
        const annualAmount = billingPeriod === 'annual' ? monthlyAmount * 12 * 0.83 : monthlyAmount;
        // Check for declined card first
        if (cardNumber === '4000 0000 0000 0002') {
            return {
                status: 'error',
                message: 'Card was declined. Please use a different card.',
            };
        }
        // Simulate payment processing (10% chance of failure for testing)
        const isSuccessful = Math.random() > 0.1;
        if (!isSuccessful) {
            return {
                status: 'error',
                message: 'Payment processing failed. Please try again.',
            };
        }
        // Generate mock transaction ID
        const transactionId = `txn_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        // Calculate next billing date
        const nextBillingDate = new Date();
        if (billingPeriod === 'monthly') {
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        }
        else {
            nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
        }
        return {
            status: 'success',
            transactionId,
            message: `Payment processed successfully! Your ${plan} plan is now active.`,
            subscription: {
                plan,
                status: 'active',
                amount: billingPeriod === 'annual' ? annualAmount : monthlyAmount,
                period: billingPeriod,
                nextBillingDate: nextBillingDate.toISOString().split('T')[0],
            },
        };
    }
    /**
     * Mock checkout session creation
     * Returns a checkout page URL (in real app, this would be Stripe)
     */
    async createCheckout(body) {
        const sessionId = `mock_session_${Date.now()}`;
        // In a real app, this would redirect to Stripe
        // For mock, we'll create a checkout page URL
        const checkoutUrl = `/checkout?session=${sessionId}&plan=${body.plan}&users=${body.userCount}&period=${body.billingPeriod}`;
        return {
            checkoutUrl,
            sessionId,
        };
    }
    /**
     * Verify payment status
     */
    async verifyPayment(body) {
        const { transactionId } = body;
        // Mock verification - all mock transactions are valid
        const isValid = transactionId.startsWith('txn_mock_');
        return {
            status: isValid ? 'paid' : 'invalid',
            verified: isValid,
        };
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('process-payment'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "processPayment", null);
__decorate([
    (0, common_1.Post)('create-checkout'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createCheckout", null);
__decorate([
    (0, common_1.Post)('verify-payment'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "verifyPayment", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('api/payments')
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map