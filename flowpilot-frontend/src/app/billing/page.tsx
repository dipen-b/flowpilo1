"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout";
import { Check, CreditCard, Download, AlertCircle, ArrowUpRight, Clock } from "lucide-react";

interface Subscription {
  plan: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  teamMembers: number;
  monthlyPrice: number;
  billingPeriod: "monthly" | "annual";
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  description: string;
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const router = require('next/navigation').useRouter();

  useEffect(() => {
    const storedSubscription = localStorage.getItem("userSubscription");

    if (storedSubscription) {
      const parsed = JSON.parse(storedSubscription);
      const planNames: Record<string, string> = {
        free: "Free",
        basic: "Basic",
        pro: "Business",
        enterprise: "Enterprise",
      };

      const today = new Date();
      const periodStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
      const periodEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];

      setSubscription({
        plan: parsed.plan,
        status: "active",
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        teamMembers: parsed.teamMembers || 5,
        monthlyPrice: parsed.monthlyPrice || 0,
        billingPeriod: parsed.billingPeriod || "monthly",
      });

      setInvoices([
        {
          id: parsed.transactionId || "INV-001",
          date: today.toISOString().split("T")[0],
          amount: parsed.monthlyPrice || 0,
          status: "paid",
          description: `FlowPilot ${planNames[parsed.plan]} Plan - ${parsed.teamMembers || 5} users`,
        },
      ]);
    } else {
      setSubscription(null);
    }

    setLoading(false);
  }, []);

  const getPlanName = (plan: string) => {
    const names: Record<string, string> = {
      free: "Free",
      basic: "Basic",
      pro: "Business",
      enterprise: "Enterprise",
    };
    return names[plan] || plan;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500";
      case "canceled":
        return "text-red-500";
      case "paused":
        return "text-yellow-500";
      default:
        return "text-secondary-text";
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "failed":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-secondary-bg text-secondary-text";
    }
  };

  const handleCancelSubscription = () => {
    const confirmed = window.confirm("Are you sure you want to cancel your subscription? You will be downgraded to the Free plan.");
    if (confirmed) {
      localStorage.removeItem("userSubscription");
      router.push("/pricing");
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-secondary-text">Loading billing details...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-primary-text">Billing & Subscription</h1>
          <p className="text-lg text-secondary-text">Manage your plan and payment methods</p>
        </div>

        {/* Current Subscription */}
        {subscription && (
          <div className="bg-secondary-bg rounded-xl border border-border p-8 space-y-8">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-primary-text">Current Plan</h2>
                <p className="text-base text-secondary-text">Active subscription</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(subscription.status)}`}>
                {subscription.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Plan</p>
                <p className="text-2xl font-bold text-primary-text">{getPlanName(subscription.plan)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Team Members</p>
                <p className="text-2xl font-bold text-primary-text">{subscription.teamMembers}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Monthly Cost</p>
                <p className="text-2xl font-bold text-primary-text">${subscription.monthlyPrice}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-secondary-text uppercase tracking-wide">Billing Cycle</p>
                <p className="text-2xl font-bold capitalize text-primary-text">{subscription.billingPeriod}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-base text-secondary-text">Current Period</span>
                <span className="text-base font-semibold text-primary-text">
                  {subscription.currentPeriodStart} to {subscription.currentPeriodEnd}
                </span>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 px-6 py-3 rounded-lg bg-primary-text text-card-bg font-semibold hover:opacity-90 transition-all">
                  Change Plan
                </button>
                <button className="flex-1 px-6 py-3 rounded-lg border border-border text-primary-text hover:bg-primary-text/5 font-semibold transition-all">
                  Update Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div className="bg-secondary-bg rounded-xl border border-border p-8 space-y-8">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary-text">Payment Method</h2>
              <p className="text-base text-secondary-text">Your credit card information</p>
            </div>
            <CreditCard className="text-primary-text" size={28} />
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-80 mb-3">Card Number</p>
                <p className="text-2xl font-mono tracking-widest">•••• •••• •••• 4242</p>
              </div>
              <Visa className="text-white/90" size={40} />
            </div>
            <div className="grid grid-cols-3 gap-6 text-sm pt-4 border-t border-blue-500/30">
              <div>
                <p className="opacity-80 mb-1">Card Holder</p>
                <p className="font-semibold">John Doe</p>
              </div>
              <div>
                <p className="opacity-80 mb-1">Expires</p>
                <p className="font-semibold">12/26</p>
              </div>
              <div>
                <p className="opacity-80 mb-1">Type</p>
                <p className="font-semibold">Visa</p>
              </div>
            </div>
          </div>

          <button className="w-full px-6 py-3 rounded-lg border border-border text-primary-text hover:bg-primary-text/5 font-semibold transition-all">
            Update Payment Method
          </button>
        </div>

        {/* Billing History */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-primary-text">Billing History</h2>
            <p className="text-base text-secondary-text">Download your invoices</p>
          </div>

          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="bg-secondary-bg rounded-lg border border-border p-6 flex items-center justify-between hover:border-primary-text/20 transition-all">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-base text-primary-text">{invoice.description}</p>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${getInvoiceStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-text">{invoice.id} • {invoice.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-primary-text">${invoice.amount}</p>
                  </div>
                </div>
                <button className="ml-6 p-2 hover:bg-card-bg rounded-lg transition-colors text-secondary-text hover:text-primary-text">
                  <Download size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 rounded-xl border border-red-500/20 p-8 space-y-4">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-500 mb-2">Cancel Subscription</h3>
              <p className="text-base text-secondary-text mb-6">
                Canceling your subscription will downgrade you to the Free plan and stop all charges.
              </p>
              <button onClick={handleCancelSubscription} className="px-6 py-3 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 font-semibold transition-colors">
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Visa({ className, size }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 48 32" width={size} height={size} className={className} fill="currentColor">
      <rect width="48" height="32" rx="4" />
      <path d="M12 16L16 8H20L16 16M28 16L32 8H36L32 16" fillOpacity="0.3" />
    </svg>
  );
}
