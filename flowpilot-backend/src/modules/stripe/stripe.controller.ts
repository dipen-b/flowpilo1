import { Controller, Post, Body, Headers } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('api/stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() body: { planId: string; userId: string; email: string }) {
    console.log(`💳 Creating checkout session for user ${body.userId} on ${body.planId} plan`);
    const session = await this.stripeService.createCheckoutSession(body);
    return { status: 'success', url: session.url, sessionId: session.id };
  }

  @Post('start-trial')
  async startTrial(@Body() body: { userId: string; email: string }) {
    console.log(`🎁 Starting 14-day trial for user ${body.userId}`);
    const subscription = await this.stripeService.startTrial(body);
    return { status: 'success', trialEndsAt: subscription.trialEndsAt, message: '14-day free trial started' };
  }

  @Post('webhook')
  async handleWebhook(@Body() event: any, @Headers('stripe-signature') signature: string) {
    console.log(`📨 Received Stripe webhook: ${event.type}`);
    const result = await this.stripeService.handleWebhook(event, signature);
    return { received: true, result };
  }

  @Post('cancel-subscription')
  async cancelSubscription(@Body() body: { userId: string }) {
    console.log(`❌ Cancelling subscription for user ${body.userId}`);
    const result = await this.stripeService.cancelSubscription(body.userId);
    return { status: 'success', message: 'Subscription cancelled', result };
  }

  @Post('upgrade-plan')
  async upgradePlan(@Body() body: { userId: string; newPlan: string }) {
    console.log(`📈 Upgrading user ${body.userId} to ${body.newPlan}`);
    const result = await this.stripeService.upgradePlan(body.userId, body.newPlan);
    return { status: 'success', message: `Upgraded to ${body.newPlan}`, result };
  }
}
