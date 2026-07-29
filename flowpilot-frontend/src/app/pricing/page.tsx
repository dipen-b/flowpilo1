"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout";
import { Check, X, Users, Zap, Rocket, Crown, Sparkles, Folder, HardDrive } from "lucide-react";

interface PlanInfo {
  name: string;
  description: string;
  billingType: string;
  pricePerUserMonth: number | null;
  pricePerUserYear: number | null;
  limits: any;
  features: Record<string, boolean>;
}

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Record<string, PlanInfo> | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [teamSize, setTeamSize] = useState(5);
  const [showCalculator, setShowCalculator] = useState(false);

  const handleCheckout = (planKey: string) => {
    // Redirect to checkout page with plan details
    const checkoutUrl = `/checkout?plan=${planKey}&users=${teamSize}&period=${billingPeriod}`;
    router.push(checkoutUrl);
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/plans");
        const data = await response.json();
        setPlans(data.data);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const calculatePrice = (plan: string, pricePerUser: number | null) => {
    if (pricePerUser === null || pricePerUser === 0) return 0;
    return pricePerUser * teamSize;
  };

  const getPrice = (plan: string) => {
    if (!plans || !plans[plan]) return 0;
    const planInfo = plans[plan];
    const pricePerUser = billingPeriod === "monthly"
      ? planInfo.pricePerUserMonth
      : planInfo.pricePerUserYear;
    return calculatePrice(plan, pricePerUser);
  };

  const getMonthlyEquivalent = (plan: string) => {
    if (!plans || !plans[plan]) return 0;
    const planInfo = plans[plan];
    const price = billingPeriod === "monthly"
      ? calculatePrice(plan, planInfo.pricePerUserMonth)
      : calculatePrice(plan, planInfo.pricePerUserYear) / 12;
    return Math.round(price * 100) / 100;
  };

  if (loading || !plans) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-secondary-text">Loading pricing...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {/* Header */}
        <div className="space-y-6 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-text">
            Pricing
          </h1>
          <p className="text-xl text-secondary-text">
            Per-user/month pricing that scales with your team.
          </p>
        </div>

        {/* Billing Toggle + Team Size */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-primary-text text-card-bg"
                  : "text-secondary-text hover:text-primary-text"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                billingPeriod === "annual"
                  ? "bg-primary-text text-card-bg"
                  : "text-secondary-text hover:text-primary-text"
              }`}
            >
              Annual
              <span className="ml-2 text-xs text-green-500">Save 17-20%</span>
            </button>
          </div>

          {/* Team Size Calculator */}
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="flex items-center gap-2 text-sm text-secondary-text hover:text-primary-text transition-colors"
          >
            <Users size={16} />
            Team size: {teamSize} people
          </button>

          {showCalculator && (
            <div className="bg-secondary-bg p-4 rounded-lg space-y-3">
              <label className="text-sm text-secondary-text">
                Adjust team size to see pricing
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-sm">
                <span className="text-primary-text font-medium">{teamSize} people</span>
                <span className="text-secondary-text"> × $10-16/person/month</span>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Cards - 4-Plan Model */}
        <div className="grid md:grid-cols-4 gap-8">
          {['free', 'basic', 'pro', 'enterprise'].map((key) => {
            const plan = plans[key];
            if (!plan) return null;

            const monthlyTotal = getPrice(key);
            const monthlyEquivalent = getMonthlyEquivalent(key);
            const isProPlan = key === 'pro';

            return (
              <div
                key={key}
                className={`rounded-xl border transition-all overflow-hidden flex flex-col h-full ${
                  isProPlan
                    ? "border-primary-text/40 bg-primary-text/5 md:scale-105 ring-2 ring-primary-text/20"
                    : "border-border bg-secondary-bg hover:border-primary-text/20"
                }`}
              >
                {/* Header */}
                <div className="p-8 pb-6 border-b border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${
                      key === 'free' ? 'bg-blue-500/10 text-blue-500' :
                      key === 'basic' ? 'bg-green-500/10 text-green-500' :
                      key === 'pro' ? 'bg-purple-500/10 text-purple-500' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>
                      {key === 'free' && <Zap size={24} />}
                      {key === 'basic' && <Rocket size={24} />}
                      {key === 'pro' && <Sparkles size={24} />}
                      {key === 'enterprise' && <Crown size={24} />}
                    </div>
                    <h2 className="text-2xl font-bold text-primary-text capitalize">
                      {plan.name}
                    </h2>
                  </div>
                  <p className="text-sm text-secondary-text mb-6">{plan.description}</p>

                  {/* Price */}
                  {key === 'free' ? (
                    <div className="space-y-1">
                      <p className="text-4xl font-bold text-primary-text">Free</p>
                      <p className="text-sm text-secondary-text">Forever free plan</p>
                    </div>
                  ) : key === 'enterprise' ? (
                    <div className="space-y-1">
                      <p className="text-4xl font-bold text-primary-text">Custom</p>
                      <p className="text-sm text-secondary-text">Contact for pricing</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-primary-text">
                          ${plan.pricePerUserMonth}
                        </span>
                        <span className="text-sm text-secondary-text">/user/month</span>
                      </div>
                      {teamSize > 1 && (
                        <p className="text-sm text-primary-text font-medium">
                          ${monthlyEquivalent}/month for {teamSize} people
                        </p>
                      )}
                      {billingPeriod === "annual" && plan.pricePerUserMonth && plan.pricePerUserYear && (
                        <p className="text-xs text-green-500 mt-2">
                          Save ${(plan.pricePerUserMonth * 12 - plan.pricePerUserYear) * teamSize}/year with annual
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <div className="px-8 pt-6 pb-6">
                  <button
                    onClick={() => {
                      if (key !== "enterprise") {
                        handleCheckout(key);
                      }
                    }}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      isProPlan
                        ? "bg-primary-text text-card-bg hover:opacity-90"
                        : "border border-primary-text/20 text-primary-text hover:bg-primary-text/5"
                    }`}
                  >
                    {key === "free"
                      ? "Get Started"
                      : key === "pro"
                      ? "Start Free Trial"
                      : key === "enterprise"
                      ? "Contact Sales"
                      : "Contact Sales"}
                  </button>
                </div>

                {/* Features */}
                <div className="px-8 pb-8 border-t border-border flex-1">
                  <div className="space-y-4 pt-6">
                    <div>
                      <p className="text-xs font-semibold text-secondary-text uppercase tracking-wide mb-4">Key Features</p>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Folder size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-primary-text">Projects</p>
                            <p className="text-sm text-secondary-text">
                              {plan.limits.maxProjects === Infinity ? "Unlimited" : plan.limits.maxProjects}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Users size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-primary-text">Team Members</p>
                            <p className="text-sm text-secondary-text">
                              {plan.limits.maxTeamMembers === Infinity ? "Unlimited" : plan.limits.maxTeamMembers}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <HardDrive size={18} className="text-purple-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-primary-text">Storage</p>
                            <p className="text-sm text-secondary-text">
                              {plan.limits.maxStorage === Infinity
                                ? "Unlimited"
                                : `${Math.round(plan.limits.maxStorage / 1024 / 1024 / 1024)}GB`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </AppLayout>
  );
}
