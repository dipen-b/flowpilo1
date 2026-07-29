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
exports.PlansController = void 0;
const common_1 = require("@nestjs/common");
const plans_service_1 = require("./plans.service");
const plans_1 = require("../../config/plans");
let PlansController = class PlansController {
    constructor(plansService) {
        this.plansService = plansService;
    }
    /**
     * Get pricing information for all plans (per-user pricing)
     */
    getAllPlans() {
        return {
            status: 'success',
            billingModel: 'per-user', // Per-user/month pricing
            data: {
                free: this.plansService.getPlanPricingInfo('free'),
                basic: this.plansService.getPlanPricingInfo('basic'),
                pro: this.plansService.getPlanPricingInfo('pro'),
                enterprise: this.plansService.getPlanPricingInfo('enterprise')
            }
        };
    }
    /**
     * Get specific plan details
     */
    getPlan(plan) {
        const validPlans = Object.keys(plans_1.PLAN_LIMITS);
        if (!validPlans.includes(plan)) {
            return {
                status: 'error',
                message: `Plan '${plan}' not found`
            };
        }
        return {
            status: 'success',
            data: {
                name: plan,
                limits: this.plansService.getPlanLimits(plan),
                features: this.plansService.getPlanFeatures(plan)
            }
        };
    }
    /**
     * Check feature availability for a plan
     */
    checkFeature(body) {
        const result = this.plansService.checkFeatureAccess(body.plan, body.feature);
        return {
            status: 'success',
            data: result
        };
    }
    /**
     * Check project creation limits
     */
    checkProjectLimit(body) {
        const result = this.plansService.canCreateProject({
            userId: 'check',
            plan: body.plan,
            storageUsed: 0,
            projectCount: body.currentProjectCount,
            teamMemberCount: 0
        });
        return {
            status: 'success',
            data: result
        };
    }
    /**
     * Check team member limits
     */
    checkMemberLimit(body) {
        const result = this.plansService.canAddTeamMember({
            userId: 'check',
            plan: body.plan,
            storageUsed: 0,
            projectCount: 0,
            teamMemberCount: body.currentMemberCount
        });
        return {
            status: 'success',
            data: result
        };
    }
    /**
     * Check storage limits
     */
    checkStorageLimit(body) {
        const result = this.plansService.canUploadFile({
            userId: 'check',
            plan: body.plan,
            storageUsed: body.currentUsage,
            projectCount: 0,
            teamMemberCount: 0
        }, body.fileSize);
        return {
            status: 'success',
            data: result
        };
    }
    /**
     * Calculate pricing based on plan and team size
     */
    calculatePrice(body) {
        const plan = body.plan;
        const userCount = body.userCount || 1;
        const billingPeriod = body.billingPeriod || 'monthly';
        const monthlyPrice = this.plansService.calculateMonthlyPrice(plan, userCount);
        const annualPrice = this.plansService.calculateAnnualPrice(plan, userCount);
        const discount = this.plansService.getAnnualDiscount(plan);
        const planInfo = this.plansService.getPlanPricingInfo(plan);
        return {
            status: 'success',
            data: {
                plan,
                userCount,
                billingModel: 'per-user',
                pricePerUser: {
                    monthly: planInfo.pricePerUserMonth,
                    annual: planInfo.pricePerUserYear
                },
                totalPrice: {
                    monthly: monthlyPrice,
                    annual: annualPrice,
                    selected: billingPeriod === 'monthly' ? monthlyPrice : (annualPrice ? Math.floor(annualPrice / 12) : null)
                },
                annualDiscount: discount,
                savings: monthlyPrice !== null && annualPrice !== null ? Math.round(monthlyPrice * 12 - annualPrice) : 0
            }
        };
    }
};
exports.PlansController = PlansController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlansController.prototype, "getAllPlans", null);
__decorate([
    (0, common_1.Get)(':plan'),
    __param(0, (0, common_1.Param)('plan')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlansController.prototype, "getPlan", null);
__decorate([
    (0, common_1.Post)('check-feature'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], PlansController.prototype, "checkFeature", null);
__decorate([
    (0, common_1.Post)('check-project-limit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], PlansController.prototype, "checkProjectLimit", null);
__decorate([
    (0, common_1.Post)('check-member-limit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], PlansController.prototype, "checkMemberLimit", null);
__decorate([
    (0, common_1.Post)('check-storage-limit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], PlansController.prototype, "checkStorageLimit", null);
__decorate([
    (0, common_1.Post)('calculate-price'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], PlansController.prototype, "calculatePrice", null);
exports.PlansController = PlansController = __decorate([
    (0, common_1.Controller)('api/plans'),
    __metadata("design:paramtypes", [plans_service_1.PlansService])
], PlansController);
//# sourceMappingURL=plans.controller.js.map