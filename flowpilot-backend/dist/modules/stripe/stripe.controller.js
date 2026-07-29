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
exports.StripeController = void 0;
const common_1 = require("@nestjs/common");
const stripe_service_1 = require("./stripe.service");
let StripeController = class StripeController {
    constructor(stripeService) {
        this.stripeService = stripeService;
    }
    async createCheckoutSession(body) {
        console.log(`💳 Creating checkout session for user ${body.userId} on ${body.planId} plan`);
        const session = await this.stripeService.createCheckoutSession(body);
        return { status: 'success', url: session.url, sessionId: session.id };
    }
    async startTrial(body) {
        console.log(`🎁 Starting 14-day trial for user ${body.userId}`);
        const subscription = await this.stripeService.startTrial(body);
        return { status: 'success', trialEndsAt: subscription.trialEndsAt, message: '14-day free trial started' };
    }
    async handleWebhook(event, signature) {
        console.log(`📨 Received Stripe webhook: ${event.type}`);
        const result = await this.stripeService.handleWebhook(event, signature);
        return { received: true, result };
    }
    async cancelSubscription(body) {
        console.log(`❌ Cancelling subscription for user ${body.userId}`);
        const result = await this.stripeService.cancelSubscription(body.userId);
        return { status: 'success', message: 'Subscription cancelled', result };
    }
    async upgradePlan(body) {
        console.log(`📈 Upgrading user ${body.userId} to ${body.newPlan}`);
        const result = await this.stripeService.upgradePlan(body.userId, body.newPlan);
        return { status: 'success', message: `Upgraded to ${body.newPlan}`, result };
    }
};
exports.StripeController = StripeController;
__decorate([
    (0, common_1.Post)('create-checkout-session'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "createCheckoutSession", null);
__decorate([
    (0, common_1.Post)('start-trial'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "startTrial", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Post)('cancel-subscription'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "cancelSubscription", null);
__decorate([
    (0, common_1.Post)('upgrade-plan'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "upgradePlan", null);
exports.StripeController = StripeController = __decorate([
    (0, common_1.Controller)('api/stripe'),
    __metadata("design:paramtypes", [stripe_service_1.StripeService])
], StripeController);
//# sourceMappingURL=stripe.controller.js.map