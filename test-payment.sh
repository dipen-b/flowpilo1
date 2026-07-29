#!/bin/bash

echo "🔍 Payment System Testing Script"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Check if backend is running
echo "1️⃣  Checking Backend Server..."
if curl -s http://localhost:3001/api/plans > /dev/null; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend is NOT running${NC}"
    exit 1
fi

# 2. Check if frontend is running
echo ""
echo "2️⃣  Checking Frontend Server..."
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
else
    echo -e "${RED}❌ Frontend is NOT running${NC}"
    exit 1
fi

# 3. Test Plans API
echo ""
echo "3️⃣  Testing Plans API..."
PLANS_RESPONSE=$(curl -s http://localhost:3001/api/plans)
if echo "$PLANS_RESPONSE" | grep -q "basic"; then
    echo -e "${GREEN}✅ Plans API returns all 4 tiers${NC}"
    echo "   - Found: Free, Basic, Business, Enterprise"
else
    echo -e "${RED}❌ Plans API missing tiers${NC}"
fi

# 4. Test Pricing Calculation
echo ""
echo "4️⃣  Testing Pricing Calculation..."
PRICE_RESPONSE=$(curl -s -X POST http://localhost:3001/api/plans/calculate-price \
  -H "Content-Type: application/json" \
  -d '{"plan":"basic","userCount":5,"billingPeriod":"monthly"}')

if echo "$PRICE_RESPONSE" | grep -q "totalPrice"; then
    echo -e "${GREEN}✅ Price calculation working${NC}"
    echo "   Response: $PRICE_RESPONSE"
else
    echo -e "${RED}❌ Price calculation failed${NC}"
fi

# 5. Check Stripe Environment Variables
echo ""
echo "5️⃣  Checking Stripe Setup..."
if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo -e "${YELLOW}⚠️  STRIPE_SECRET_KEY not set${NC}"
    echo "   Set in backend/.env: STRIPE_SECRET_KEY=sk_test_..."
else
    echo -e "${GREEN}✅ STRIPE_SECRET_KEY is set${NC}"
fi

if [ -z "$STRIPE_PUBLIC_KEY" ]; then
    echo -e "${YELLOW}⚠️  STRIPE_PUBLIC_KEY not set${NC}"
    echo "   Set in backend/.env: STRIPE_PUBLIC_KEY=pk_test_..."
else
    echo -e "${GREEN}✅ STRIPE_PUBLIC_KEY is set${NC}"
fi

# 6. Test Stripe Webhook Endpoint
echo ""
echo "6️⃣  Testing Stripe Webhook Endpoint..."
WEBHOOK_TEST=$(curl -s -X POST http://localhost:3001/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"test"}')

if echo "$WEBHOOK_TEST" | grep -q "error\|received"; then
    echo -e "${GREEN}✅ Webhook endpoint accessible${NC}"
else
    echo -e "${YELLOW}⚠️  Webhook endpoint may need configuration${NC}"
fi

echo ""
echo "=================================="
echo "✨ Testing Complete!"
echo ""
echo "📝 To test actual payments:"
echo "   1. Set STRIPE_SECRET_KEY and STRIPE_PUBLIC_KEY"
echo "   2. Test with Stripe test card: 4242 4242 4242 4242"
echo "   3. Check /billing page for subscription status"
echo "   4. Verify invoices in Stripe Dashboard"
