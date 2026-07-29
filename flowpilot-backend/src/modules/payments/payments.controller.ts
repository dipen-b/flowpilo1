import { Controller, Post, Body } from '@nestjs/common';

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

@Controller('api/payments')
export class PaymentsController {
  /**
   * Mock payment processing endpoint
   * Simulates payment without actually charging
   */
  @Post('process-payment')
  async processPayment(@Body() body: MockPaymentRequest): Promise<MockPaymentResponse> {
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
    } else {
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
  @Post('create-checkout')
  async createCheckout(@Body() body: MockPaymentRequest): Promise<{ checkoutUrl: string; sessionId: string }> {
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
  @Post('verify-payment')
  async verifyPayment(@Body() body: { transactionId: string }): Promise<{ status: string; verified: boolean }> {
    const { transactionId } = body;

    // Mock verification - all mock transactions are valid
    const isValid = transactionId.startsWith('txn_mock_');

    return {
      status: isValid ? 'paid' : 'invalid',
      verified: isValid,
    };
  }
}
