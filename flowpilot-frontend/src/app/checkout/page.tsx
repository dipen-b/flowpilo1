"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout";
import { Check, AlertCircle, Loader } from "lucide-react";

export const dynamic = "force-dynamic";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [plan, setPlan] = useState("");
  const [users, setUsers] = useState(1);
  const [period, setPeriod] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/25");
  const [cardCvc, setCardCvc] = useState("123");

  useEffect(() => {
    const planParam = searchParams.get("plan") || "basic";
    const usersParam = parseInt(searchParams.get("users") || "1");
    const periodParam = searchParams.get("period") || "monthly";

    setPlan(planParam);
    setUsers(usersParam);
    setPeriod(periodParam);
  }, [searchParams]);

  const planPrices: Record<string, number> = {
    free: 0,
    basic: 10,
    pro: 16,
    enterprise: 0,
  };

  const monthlyPrice = (planPrices[plan] || 0) * users;
  const annualPrice = Math.round(monthlyPrice * 12 * 0.83);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/payments/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          userCount: users,
          billingPeriod: period,
          cardNumber,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setSuccess(true);
        setTransactionId(data.transactionId);

        // Store subscription in localStorage (mock)
        localStorage.setItem("userSubscription", JSON.stringify({
          plan,
          status: "active",
          teamMembers: users,
          monthlyPrice,
          billingPeriod: period,
          transactionId: data.transactionId,
        }));

        // Redirect to billing after 3 seconds
        setTimeout(() => {
          router.push("/billing");
        }, 3000);
      } else {
        setError(data.message || "Payment failed. Please try again.");
      }
    } catch (err) {
      setError("Payment processing error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-secondary-text">Loading checkout...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-primary-text">Checkout</h1>
          <p className="text-secondary-text">Complete your subscription</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-secondary-bg rounded-lg p-8 border border-border space-y-6">
            <h2 className="text-2xl font-bold text-primary-text">Order Summary</h2>

            {/* Plan Details */}
            <div className="space-y-4 pb-4 border-b border-border">
              <div className="flex justify-between">
                <span className="text-secondary-text">Plan</span>
                <span className="text-primary-text font-medium capitalize">{plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text">Team Members</span>
                <span className="text-primary-text font-medium">{users}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text">Billing Period</span>
                <span className="text-primary-text font-medium capitalize">{period}</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-secondary-text">Monthly Price</span>
                <span className="text-primary-text">${monthlyPrice}</span>
              </div>
              {period === "annual" && (
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-text">Annual Discount (17%)</span>
                  <span className="text-green-500">-${monthlyPrice * 12 - annualPrice}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
                <span className="text-primary-text">Total</span>
                <span className="text-primary-text">
                  ${period === "monthly" ? monthlyPrice : Math.round(annualPrice / 12)}/{period === "monthly" ? "month" : "month (annual)"}
                </span>
              </div>
            </div>

            {/* Mock Badge */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-500 text-sm">
              ℹ️ This is a mock payment. No real charges will be made.
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-secondary-bg rounded-lg p-8 border border-border space-y-6">
            <h2 className="text-2xl font-bold text-primary-text">Payment Details</h2>

            {success ? (
              <div className="space-y-6 py-12 text-center">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Check size={32} className="text-green-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-green-500">Payment Successful!</h3>
                  <p className="text-secondary-text">Your subscription is now active</p>
                  <p className="text-sm text-secondary-text">Transaction ID: {transactionId}</p>
                </div>
                <p className="text-secondary-text text-sm">Redirecting to billing dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handlePayment} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-3 text-red-500">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {/* Card Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-text">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-4 py-2 bg-card-bg border border-border rounded-lg text-primary-text placeholder-secondary-text focus:outline-none focus:border-primary-text"
                  />
                  <p className="text-xs text-secondary-text">Test: 4242 4242 4242 4242 (success) or 4000 0000 0000 0002 (decline)</p>
                </div>

                {/* Expiry & CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary-text">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 bg-card-bg border border-border rounded-lg text-primary-text placeholder-secondary-text focus:outline-none focus:border-primary-text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary-text">CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="123"
                      className="w-full px-4 py-2 bg-card-bg border border-border rounded-lg text-primary-text placeholder-secondary-text focus:outline-none focus:border-primary-text"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-primary-text text-card-bg font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Complete Payment - $${period === "monthly" ? monthlyPrice : Math.round(annualPrice / 12)}`
                  )}
                </button>

                <p className="text-xs text-secondary-text text-center">
                  💳 This is a mock payment system for testing purposes only
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
