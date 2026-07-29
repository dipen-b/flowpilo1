import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { PlansService, CheckFeatureResult } from './plans.service';
import { PLAN_LIMITS } from '@/config/plans';

@Controller('api/plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  /**
   * Get pricing information for all plans (per-user pricing)
   */
  @Get()
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
  @Get(':plan')
  getPlan(@Param('plan') plan: string) {
    const validPlans = Object.keys(PLAN_LIMITS) as (keyof typeof PLAN_LIMITS)[];
    if (!validPlans.includes(plan as any)) {
      return {
        status: 'error',
        message: `Plan '${plan}' not found`
      };
    }

    return {
      status: 'success',
      data: {
        name: plan,
        limits: this.plansService.getPlanLimits(plan as any),
        features: this.plansService.getPlanFeatures(plan as any)
      }
    };
  }

  /**
   * Check feature availability for a plan
   */
  @Post('check-feature')
  checkFeature(@Body() body: { plan: string; feature: string }): { status: string; data: CheckFeatureResult } {
    const result = this.plansService.checkFeatureAccess(body.plan as any, body.feature as any);
    return {
      status: 'success',
      data: result
    };
  }

  /**
   * Check project creation limits
   */
  @Post('check-project-limit')
  checkProjectLimit(@Body() body: { plan: string; currentProjectCount: number }): { status: string; data: CheckFeatureResult } {
    const result = this.plansService.canCreateProject({
      userId: 'check',
      plan: body.plan as any,
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
  @Post('check-member-limit')
  checkMemberLimit(@Body() body: { plan: string; currentMemberCount: number }): { status: string; data: CheckFeatureResult } {
    const result = this.plansService.canAddTeamMember({
      userId: 'check',
      plan: body.plan as any,
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
  @Post('check-storage-limit')
  checkStorageLimit(@Body() body: { plan: string; currentUsage: number; fileSize: number }): { status: string; data: CheckFeatureResult } {
    const result = this.plansService.canUploadFile({
      userId: 'check',
      plan: body.plan as any,
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
  @Post('calculate-price')
  calculatePrice(@Body() body: { plan: string; userCount: number; billingPeriod: 'monthly' | 'annual' }): { status: string; data: any } {
    const plan = body.plan as any;
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
}
