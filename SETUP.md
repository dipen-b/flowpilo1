# FlowPilot Setup Guide

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

## Database Setup

### Development (SQLite)
SQLite is configured by default for development. The database file is created automatically.

### Production (PostgreSQL)
Set `DATABASE_URL` to your PostgreSQL connection string:

```
DATABASE_URL="postgresql://user:password@host:5432/flowpilot"
```

Then run migrations:
```bash
npx prisma migrate deploy
npx prisma db seed
```

## GitHub OAuth Setup

### 1. Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click **New OAuth App**
3. Fill in the application details:
   - **Application name**: FlowPilot
   - **Homepage URL**: `http://localhost:3000` (or your production domain)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/github/callback`
4. Copy the **Client ID** and **Client Secret**

### 2. Configure Environment Variables

Add to `.env.local`:
```
GITHUB_OAUTH_CLIENT_ID="your-client-id"
GITHUB_OAUTH_CLIENT_SECRET="your-client-secret"
```

### 3. Connect GitHub Account

1. Go to Settings → Integrations
2. Click "Connect GitHub"
3. Authorize the OAuth app
4. Your GitHub account is now connected

## GitHub Webhooks Setup

### 1. Generate Webhook Secret

Generate a secure random secret:
```bash
openssl rand -base64 32
```

Add to `.env.local`:
```
GITHUB_WEBHOOK_SECRET="your-generated-secret"
```

### 2. Configure Webhook in GitHub

For each repository you want to automate:

1. Go to your GitHub repo → Settings → Webhooks → Add webhook
2. Fill in:
   - **Payload URL**: `https://yourdomain.com/api/webhooks/github`
   - **Content type**: application/json
   - **Secret**: Your webhook secret from `.env.local`
   - **Events**: Select "Pushes"
3. Click "Add webhook"

### 3. Use Webhooks

In commit messages, reference task keys with keywords:

```bash
# Move task to Done
git commit -m "Fixes BANK-152: implement auth flow"
git commit -m "Closes BANK-152"
git commit -m "Resolves BANK-152"

# Move task to In Progress
git commit -m "WIP: BANK-152 auth implementation"
git commit -m "WIP BANK-152"
```

## Authentication

### NextAuth Secret

Generate a secure secret:
```bash
openssl rand -base64 32
```

Add to `.env.local`:
```
NEXTAUTH_SECRET="your-generated-secret"
```

## Running the App

```bash
# Install dependencies
npm install

# Run database migrations (production)
npx prisma migrate deploy

# Start dev server
npm run dev

# Build for production
npm run build
npm start
```

## Troubleshooting

### GitHub OAuth not working
- Verify `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET` are correct
- Check callback URL matches exactly in GitHub app settings
- Ensure `NEXTAUTH_URL` matches your domain

### Webhooks not triggering
- Verify webhook secret matches `GITHUB_WEBHOOK_SECRET`
- Check webhook "Recent Deliveries" tab in GitHub for errors
- Ensure payload URL is publicly accessible
- Verify commit message contains valid task key (e.g., BANK-152)

### Database connection fails
- For PostgreSQL: verify `DATABASE_URL` connection string
- For SQLite: ensure `./prisma/dev.db` has write permissions
- Run `npx prisma db push` to sync schema
