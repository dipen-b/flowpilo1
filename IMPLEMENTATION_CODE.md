# 💻 Freemium Implementation Code

**Ready-to-use code for monetization**

---

## 🗄️ Database Schema Updates

### 1. Add Plan Column to Users

```sql
-- Add plan column
ALTER TABLE users ADD COLUMN plan VARCHAR(50) DEFAULT 'free';
ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255);
ALTER TABLE users ADD COLUMN stripe_subscription_id VARCHAR(255);
ALTER TABLE users ADD COLUMN subscription_status VARCHAR(50) DEFAULT 'none';
ALTER TABLE users ADD COLUMN trial_ends_at TIMESTAMP;
ALTER TABLE users ADD COLUMN subscription_ends_at TIMESTAMP;
ALTER TABLE users ADD COLUMN storage_used BIGINT DEFAULT 0;
```

### 2. Create Subscription Events Table

```sql
CREATE TABLE subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  event_type VARCHAR(50), -- subscription_created, upgraded, downgraded, cancelled
  old_plan VARCHAR(50),
  new_plan VARCHAR(50),
  amount_paid DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Create Usage Tracking Table

```sql
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  month_year VARCHAR(7), -- '2026-07'
  projects_created INT DEFAULT 0,
  files_uploaded INT DEFAULT 0,
  storage_used BIGINT DEFAULT 0,
  team_members_added INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);
```

---

## ⚙️ Backend: Plan Limits Configuration

### Define Limits in TypeScript

```typescript
// src/config/plans.ts
export const PLAN_LIMITS = {
  free: {
    maxProjects: 5,
    maxTeamMembers: 3,
    maxStorage: 500 * 1024 * 1024, // 500MB
    maxActivityEntries: 100,
    features: {
      ganttChart: false,
      advancedReports: false,
      slackIntegration: false,
      customWorkflows: false,
      desktopNotifications: false,
      emailDigests: false,
      sso: false,
      apiAccess: false,
    }
  },
  pro: {
    maxProjects: Infinity,
    maxTeamMembers: 50,
    maxStorage: 10 * 1024 * 1024 * 1024, // 10GB
    maxActivityEntries: 10000,
    features: {
      ganttChart: true,
      advancedReports: true,
      slackIntegration: true,
      customWorkflows: true,
      desktopNotifications: true,
      emailDigests: true,
      sso: false,
      apiAccess: true,
    }
  },
  enterprise: {
    maxProjects: Infinity,
    maxTeamMembers: Infinity,
    maxStorage: Infinity,
    maxActivityEntries: Infinity,
    features: {
      ganttChart: true,
      advancedReports: true,
      slackIntegration: true,
      customWorkflows: true,
      desktopNotifications: true,
      emailDigests: true,
      sso: true,
      apiAccess: true,
    }
  }
};

export const STRIPE_PRICES = {
  pro_monthly: 'price_1Abc123XYZ', // $29/month
  pro_annual: 'price_1Abc456XYZ',  // $290/year
};
```

---

## 🚪 Checking Plan Limits

### 1. Middleware to Check Feature Access

```typescript
// src/middleware/checkPlan.ts
import { PLAN_LIMITS } from '@/config/plans';

export async function checkPlanFeature(userId: string, feature: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { plan: true }
  });

  if (!user) throw new Error('User not found');
  
  const hasFeature = PLAN_LIMITS[user.plan].features[feature];
  
  if (!hasFeature) {
    return {
      allowed: false,
      message: `This feature is only available on the Pro plan`,
      upgradeUrl: '/pricing'
    };
  }
  
  return { allowed: true };
}

export async function checkStorageLimit(userId: string, fileSizeBytes: number) {
  const user = await db.user.findUnique({
    where: { id: userId }
  });

  const newUsage = user.storageUsed + fileSizeBytes;
  const limit = PLAN_LIMITS[user.plan].maxStorage;

  if (newUsage > limit) {
    return {
      allowed: false,
      currentUsage: user.storageUsed,
      limit: limit,
      message: `Storage limit exceeded. Current: ${formatBytes(user.storageUsed)} / Limit: ${formatBytes(limit)}`
    };
  }

  return { allowed: true };
}
```

### 2. Check Project Limit

```typescript
// src/services/projects.ts
import { checkPlanFeature } from '@/middleware/checkPlan';

export async function createProject(userId: string, data: CreateProjectDTO) {
  const user = await db.user.findUnique({
    where: { id: userId }
  });

  const projectCount = await db.project.count({
    where: { createdBy: userId }
  });

  const maxProjects = PLAN_LIMITS[user.plan].maxProjects;

  if (projectCount >= maxProjects) {
    return {
      status: 'error',
      code: 'PLAN_LIMIT_EXCEEDED',
      message: `You've reached the limit of ${maxProjects} projects for the ${user.plan} plan`,
      currentCount: projectCount,
      limit: maxProjects,
      upgradeUrl: '/pricing'
    };
  }

  // Create project...
  return { status: 'success', data: newProject };
}
```

### 3. Check Team Member Limit

```typescript
// src/services/team.ts
export async function addTeamMember(userId: string, memberEmail: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { team: { select: { _count: true } } }
  });

  const memberCount = user.team._count;
  const maxMembers = PLAN_LIMITS[user.plan].maxTeamMembers;

  if (memberCount >= maxMembers) {
    return {
      status: 'error',
      code: 'PLAN_LIMIT_EXCEEDED',
      message: `You've reached the limit of ${maxMembers} team members for the ${user.plan} plan`,
      currentCount: memberCount,
      limit: maxMembers,
      upgradeUrl: '/pricing'
    };
  }

  // Add team member...
}
```

---

## 💳 Stripe Integration

### 1. Create Subscription

```typescript
// src/services/subscription.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createProSubscription(userId: string, email: string) {
  const user = await db.user.findUnique({ where: { id: userId } });

  // Create or get Stripe customer
  let stripeCustomer;
  if (user.stripeCustomerId) {
    stripeCustomer = await stripe.customers.retrieve(user.stripeCustomerId);
  } else {
    stripeCustomer = await stripe.customers.create({
      email: email,
      metadata: { userId }
    });
    
    // Save Stripe customer ID
    await db.user.update({
      where: { id: userId },
      data: { stripeCustomerId: stripeCustomer.id }
    });
  }

  // Create subscription (14-day free trial)
  const subscription = await stripe.subscriptions.create({
    customer: stripeCustomer.id,
    items: [{ price: process.env.STRIPE_PRICE_PRO_MONTHLY! }],
    trial_period_days: 14,
    metadata: { userId }
  });

  // Update user
  await db.user.update({
    where: { id: userId },
    data: {
      stripeSubscriptionId: subscription.id,
      plan: 'pro',
      trialEndsAt: new Date(subscription.trial_end! * 1000),
      subscriptionStatus: subscription.status
    }
  });

  // Log event
  await db.subscriptionEvent.create({
    data: {
      userId,
      eventType: 'subscription_created',
      oldPlan: 'free',
      newPlan: 'pro',
      amountPaid: 0 // Free trial
    }
  });

  return subscription;
}
```

### 2. Handle Webhook Events

```typescript
// src/api/webhooks/stripe.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  const userId = event.data.object.metadata?.userId;

  switch (event.type) {
    case 'customer.subscription.created':
      // Already handled in createProSubscription
      break;

    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      await db.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: subscription.status,
          subscriptionEndsAt: subscription.current_period_end 
            ? new Date(subscription.current_period_end * 1000)
            : null
        }
      });
      break;

    case 'customer.subscription.deleted':
      // User cancelled subscription
      await db.user.update({
        where: { id: userId },
        data: {
          plan: 'free',
          subscriptionStatus: 'cancelled',
          stripeSubscriptionId: null
        }
      });
      
      // Send email: "We'll miss you!"
      await sendEmail(userId, 'subscription_cancelled');
      break;

    case 'invoice.payment_succeeded':
      // Payment successful
      const invoice = event.data.object as Stripe.Invoice;
      await db.subscriptionEvent.create({
        data: {
          userId,
          eventType: 'payment_success',
          amountPaid: invoice.amount_paid / 100 // Convert from cents
        }
      });
      break;

    case 'invoice.payment_failed':
      // Payment failed - send reminder email
      await sendEmail(userId, 'payment_failed');
      break;
  }

  return NextResponse.json({ ok: true });
}
```

---

## 🎨 Frontend: Upgrade Prompts

### 1. React Component: Upgrade Modal

```typescript
// src/components/UpgradeModal.tsx
import { useState } from 'react';

interface UpgradeModalProps {
  title: string;
  message: string;
  currentLimit: number;
  planUpgrade: string;
  onClose: () => void;
}

export function UpgradeModal({
  title,
  message,
  currentLimit,
  planUpgrade,
  onClose
}: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // Navigate to checkout or start trial
      const response = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({ plan: planUpgrade })
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Upgrade failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-card-bg rounded-lg p-6 max-w-md">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-secondary-text mb-4">{message}</p>
        
        <div className="bg-secondary-bg p-3 rounded mb-6">
          <p className="text-sm">
            Upgrade to <span className="font-bold">Pro</span> for:
          </p>
          <ul className="text-sm text-secondary-text mt-2 space-y-1">
            <li>✓ Unlimited projects</li>
            <li>✓ 50 team members</li>
            <li>✓ 10GB storage</li>
            <li>✓ Advanced reports</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded border border-border"
          >
            Cancel
          </button>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded bg-blue-600 text-white"
          >
            {loading ? 'Loading...' : 'Upgrade to Pro'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 2. Use in Create Project

```typescript
// src/app/projects/page.tsx
import { createProject } from '@/services/projects';
import { UpgradeModal } from '@/components/UpgradeModal';
import { useState } from 'react';

export function ProjectsPage() {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('');

  const handleCreateProject = async (data: CreateProjectDTO) => {
    const result = await createProject(data);

    if (result.code === 'PLAN_LIMIT_EXCEEDED') {
      setUpgradeMessage(result.message);
      setShowUpgrade(true);
      return;
    }

    // Project created successfully
    refetch();
  };

  return (
    <div>
      <button onClick={() => handleCreateProject({...})}>
        Create Project
      </button>

      {showUpgrade && (
        <UpgradeModal
          title="Create More Projects"
          message={upgradeMessage}
          planUpgrade="pro"
          onClose={() => setShowUpgrade(false)}
        />
      )}
    </div>
  );
}
```

---

## 📊 Storage Usage Tracking

### 1. Track Storage on File Upload

```typescript
// src/services/files.ts
export async function uploadFile(userId: string, file: File) {
  // Check storage limit
  const storageCheck = await checkStorageLimit(userId, file.size);
  if (!storageCheck.allowed) {
    return {
      status: 'error',
      code: 'STORAGE_LIMIT_EXCEEDED',
      ...storageCheck
    };
  }

  // Upload to S3 or storage service
  const fileUrl = await uploadToStorage(file);

  // Save to database
  const dbFile = await db.file.create({
    data: {
      userId,
      name: file.name,
      size: file.size,
      url: fileUrl
    }
  });

  // Update user storage used
  await db.user.update({
    where: { id: userId },
    data: {
      storageUsed: {
        increment: file.size
      }
    }
  });

  // Update usage tracking
  const monthYear = new Date().toISOString().slice(0, 7); // '2026-07'
  await db.usageTracking.upsert({
    where: { userId_monthYear: { userId, monthYear } },
    create: {
      userId,
      monthYear,
      filesUploaded: 1
    },
    update: {
      filesUploaded: { increment: 1 }
    }
  });

  return { status: 'success', data: dbFile };
}
```

### 2. Storage Usage Display Component

```typescript
// src/components/StorageUsage.tsx
export function StorageUsage({ user }: { user: User }) {
  const planLimits = PLAN_LIMITS[user.plan];
  const percentage = (user.storageUsed / planLimits.maxStorage) * 100;
  const isFull = percentage > 90;

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm">Storage</span>
        <span className="text-sm text-secondary-text">
          {formatBytes(user.storageUsed)} / {formatBytes(planLimits.maxStorage)}
        </span>
      </div>

      <div className={`h-2 rounded-full ${isFull ? 'bg-red-600' : 'bg-blue-600'} w-${Math.round(percentage)}`} />

      {isFull && (
        <p className="text-xs text-red-600">
          Storage nearly full. <a href="/pricing" className="underline">Upgrade to Pro for 10GB</a>
        </p>
      )}
    </div>
  );
}
```

---

## 📧 Email Notifications

### Email Templates to Send

```typescript
// src/emails/templates.ts

export const emailTemplates = {
  // When user reaches trial end
  trialEnding: (user) => ({
    subject: "Your FlowPilot trial expires in 3 days",
    text: `
Hi ${user.name},

Your 14-day free trial of FlowPilot Pro expires on ${user.trialEndsAt.toDateString()}.

Don't lose access to:
- Unlimited projects
- Gantt charts
- Advanced reports
- Slack integration

Continue your Pro subscription for just $29/month.
    `
  }),

  // When trial expires
  trialExpired: (user) => ({
    subject: "Your FlowPilot trial has expired",
    text: `
Hi ${user.name},

Your trial of FlowPilot Pro has ended. You're back on the Free plan with 5 projects and 500MB storage.

Want to continue using Pro features? Upgrade now: ${CHECKOUT_URL}
    `
  }),

  // When payment fails
  paymentFailed: (user) => ({
    subject: "Payment failed for FlowPilot Pro",
    text: `
Hi ${user.name},

Your payment for FlowPilot Pro failed. Update your payment method: ${BILLING_URL}

Without this, your subscription will be cancelled on ${user.subscriptionEndsAt?.toDateString()}.
    `
  }),

  // When user downgrades
  downgradeConfirmed: (user) => ({
    subject: "You're back on the Free plan",
    text: `
Hi ${user.name},

Your Pro subscription has been cancelled. You now have:
- 5 projects (you have ${userProjectCount})
- 3 team members (you have ${userTeamSize})
- 500MB storage (you use ${formatBytes(user.storageUsed)})

Upgrade anytime to Pro: ${PRICING_URL}
    `
  })
};
```

---

## 🎯 Pricing Page (React)

```typescript
// src/app/pricing/page.tsx
export function PricingPage() {
  const [loading, setLoading] = useState(false);

  const handleStartTrial = async () => {
    setLoading(true);
    const response = await fetch('/api/checkout/trial', {
      method: 'POST'
    });
    const { url } = await response.json();
    window.location.href = url;
  };

  return (
    <div className="max-w-6xl mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h1>
      <p className="text-center text-secondary-text mb-12">
        Choose the plan that's right for you. Always free to get started.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {/* FREE PLAN */}
        <Card>
          <h3 className="text-2xl font-bold">Free</h3>
          <p className="text-4xl font-bold my-4">$0<span className="text-lg">/month</span></p>
          <p className="text-secondary-text mb-6">Forever free, always</p>
          
          <ul className="space-y-3 mb-6">
            <li>✓ 5 projects</li>
            <li>✓ 3 team members</li>
            <li>✓ 500MB storage</li>
            <li>✓ Real-time notifications</li>
            <li>✓ Basic views</li>
            <li>✗ Gantt charts</li>
            <li>✗ Advanced reports</li>
          </ul>

          <button className="w-full py-2 border border-border rounded">
            You're on this plan
          </button>
        </Card>

        {/* PRO PLAN */}
        <Card className="ring-2 ring-blue-600">
          <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm mb-4">
            Most Popular
          </div>
          <h3 className="text-2xl font-bold">Pro</h3>
          <p className="text-4xl font-bold my-4">$29<span className="text-lg">/month</span></p>
          <p className="text-secondary-text mb-6">or $290/year (save $58)</p>
          
          <ul className="space-y-3 mb-6">
            <li>✓ Unlimited projects</li>
            <li>✓ 50 team members</li>
            <li>✓ 10GB storage</li>
            <li>✓ Gantt charts</li>
            <li>✓ Advanced reports</li>
            <li>✓ Slack integration</li>
            <li>✓ Custom workflows</li>
          </ul>

          <button
            onClick={handleStartTrial}
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded"
          >
            {loading ? 'Loading...' : 'Start 14-Day Free Trial'}
          </button>
        </Card>

        {/* ENTERPRISE */}
        <Card>
          <h3 className="text-2xl font-bold">Enterprise</h3>
          <p className="text-4xl font-bold my-4">Custom</p>
          <p className="text-secondary-text mb-6">For large organizations</p>
          
          <ul className="space-y-3 mb-6">
            <li>✓ Everything in Pro</li>
            <li>✓ Unlimited everything</li>
            <li>✓ Custom integrations</li>
            <li>✓ SSO / SAML</li>
            <li>✓ White-label</li>
            <li>✓ SLA guarantee</li>
            <li>✓ Dedicated support</li>
          </ul>

          <button className="w-full py-2 border border-border rounded">
            Contact Sales
          </button>
        </Card>
      </div>
    </div>
  );
}
```

---

## 🔧 Setup Checklist

### Backend Setup
- [ ] Add database columns (plan, stripe_customer_id, etc.)
- [ ] Create plan limits configuration
- [ ] Implement feature gates/middleware
- [ ] Create Stripe integration service
- [ ] Add webhook handlers
- [ ] Set environment variables
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PUBLIC_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_PRICE_PRO_MONTHLY`
  - `STRIPE_PRICE_PRO_ANNUAL`

### Frontend Setup
- [ ] Create pricing page
- [ ] Add upgrade modals
- [ ] Add storage usage display
- [ ] Create subscription dashboard
- [ ] Add Stripe public key

### Stripe Setup
- [ ] Create Stripe account (stripe.com)
- [ ] Create products (Free, Pro, Enterprise)
- [ ] Create price records
- [ ] Get API keys
- [ ] Set webhook endpoint
- [ ] Test webhook locally with Stripe CLI

---

## 🚀 Quick Start Command

```bash
# 1. Install Stripe SDK
npm install stripe next-stripe

# 2. Set environment variables in .env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# 3. Update database schema
npx prisma migrate dev

# 4. Test webhook locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 5. Create test subscription
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"plan":"pro"}'
```

---

**You're ready to monetize! 💰**

This code gives you everything needed to implement a freemium model. Use it as a starting point and customize to your needs.
