# FlowPilot — Project Management on Autopilot

FlowPilot is an AI-first project management platform. Instead of making you the database
administrator of your own work (Jira, ClickUp), FlowPilot acts as an **AI Project Manager**
that plans projects, creates tasks, manages sprints, predicts delivery dates, detects risks,
and generates documentation — automatically.

> Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and Framer Motion.

## Features

- **Landing page** — hero, AI features, how-it-works, testimonials, pricing, FAQ
- **Authentication** — email + OTP, Google / GitHub / Microsoft login, SAML SSO ready
- **Dashboard** — AI health score, delivery forecast, risk alerts, burndown, workload heatmap, AI recommendations
- **AI Copilot** — floating assistant on every app page (create projects, plan sprints, find blockers, generate reports)
- **Projects** — Board / List / Timeline / Calendar views with AI dependency detection
- **Sprints** — burndown, velocity, auto sprint planning, retrospectives
- **Team** — workload, burnout detection, AI team coach
- **Analytics** — executive summaries, delivery forecasts, success probability
- **Docs Hub** — one-click release notes, sprint reports, executive summaries
- **Automations** — plain-English workflow builder, meeting-to-tasks, voice-to-tickets
- **Admin** — members & roles, billing, security, audit log, integrations
- **Design system** — full light/dark mode, colorblind-safe charts, WCAG AA

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Documentation

Architecture, database schema, API design, AI architecture, multi-tenancy, design system,
and the production roadmap live in [`docs/`](./docs).

## Tech stack

| Layer     | Technology                                              |
| --------- | ------------------------------------------------------- |
| Frontend  | Next.js, React, TypeScript, Tailwind CSS, Framer Motion |
| Backend   | NestJS, PostgreSQL, Redis (see `docs/`)                 |
| AI        | OpenAI + Claude, RAG, pgvector                          |
| Cloud     | AWS (ECS, RDS, ElastiCache, S3, CloudFront)             |
