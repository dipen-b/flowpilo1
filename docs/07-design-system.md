# FlowPilot — Design System ("Flow UI")

Built on Tailwind + shadcn/ui + Framer Motion. Aesthetic north stars: **Linear** (speed, keyboard-first density), **Notion** (calm content surfaces), **Stripe** (typographic precision, restrained gradients).

## 1. Brand Principles

1. **Calm by default, vivid on intent.** Neutral surfaces; the indigo→violet accent appears only on primary actions, focus, and AI moments.
2. **AI is a material, not a mascot.** Copilot surfaces get one consistent signature — the accent gradient hairline + soft glow — never sparkle-emoji noise.
3. **Fast is a feature.** No decoration that costs frames; every transition ≤ 250ms; skeletons only past 300ms (`02-ux-flows.md` §10).
4. **Density with air.** Compact rows (36px) but generous section padding; one accent per view.
5. **Dark-first.** Designed on dark, verified on light — engineers live in dark mode.

## 2. Color Tokens

CSS variables, consumed via Tailwind config (`hsl(var(--…))` pattern). Base scale is a near-black blue-tinted neutral.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg-base` | `#0A0A0F` | `#FFFFFF` | App background |
| `--bg-surface` | `#111118` | `#FAFAFB` | Cards, panels |
| `--bg-raised` | `#1A1A23` | `#FFFFFF` (+shadow) | Popovers, modals |
| `--bg-inset` | `#07070B` | `#F4F4F6` | Wells, code, kanban columns |
| `--border-subtle` | `#26262F` | `#E8E8EC` | Hairlines, dividers |
| `--border-strong` | `#3A3A46` | `#D4D4DA` | Inputs, focused cards |
| `--text-primary` | `#F4F4F6` | `#0A0A0F` | Headings, body |
| `--text-secondary` | `#A0A0AC` | `#5C5C66` | Metadata, labels |
| `--text-tertiary` | `#6B6B76` | `#8E8E99` | Placeholders, timestamps |
| `--accent` | `#6366F1` | `#6366F1` | Primary actions, focus rings, links |
| `--accent-hover` | `#7C7FF4` | `#4F52E9` | Hover states |
| `--accent-soft` | `#6366F1` @ 12% | `#6366F1` @ 8% | Selected rows, active nav |
| `--gradient-ai` | `linear-gradient(135deg,#6366F1 0%,#8B5CF6 60%,#A855F7 100%)` | same | Copilot signature only |
| `--success` | `#10B981` | `#059669` | Done, positive deltas |
| `--warning` | `#F59E0B` | `#D97706` | At-risk, degraded |
| `--danger` | `#EF4444` | `#DC2626` | Blocked, destructive, errors |
| `--info` | `#38BDF8` | `#0284C7` | Neutral callouts |

Semantic status mapping (fixed product-wide): `backlog` tertiary · `todo` secondary · `in_progress` accent · `in_review` `#F59E0B` · `done` `#10B981` · `cancelled` tertiary strikethrough. Priority: P0 `--danger`, P1 `#F97316`, P2 `--warning`, P3 secondary, P4 tertiary.

Each semantic color ships a `-soft` (12% alpha bg) and `-border` (32% alpha) companion for badges/banners.

## 3. Typography

Primary: **Geist Sans** (fallback **Inter**, then system stack). Mono: **Geist Mono** (IDs, code, shortcuts).

| Token | Size/Line | Weight | Use |
|---|---|---|---|
| `display` | 32/38 | 600, -0.02em | Marketing, empty states |
| `h1` | 24/30 | 600, -0.01em | Page titles |
| `h2` | 18/26 | 600 | Section headers |
| `h3` | 15/22 | 600 | Card titles, modal headers |
| `body` | 14/22 | 400 | Default UI text |
| `body-strong` | 14/22 | 500 | Emphasis, row titles |
| `small` | 13/18 | 400 | Metadata, table cells |
| `micro` | 11/14 | 500, +0.02em, uppercase opt. | Badges, column headers |

Numbers in analytics use `font-variant-numeric: tabular-nums`.

## 4. Spacing, Radius, Elevation

- **Spacing:** 4px base — `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`. Component-internal padding uses 8/12/16; section gaps 24/32; page gutters 24 (mobile 16).
- **Radius:** `--r-sm: 6px` (badges, inputs-inline), `--r-md: 10px` (buttons, inputs), `--r-lg: 12px` (kanban cards, list cards), `--r-xl: 16px` (modals, copilot panel, feature cards), `--r-full` (avatars, pills). Cards live in the 12–16px band; never mix radii in one composite component.
- **Elevation (dark mode uses borders more than shadows):**
  - `e0` flat: border-subtle only
  - `e1` card: `0 1px 2px rgb(0 0 0 / .24)` + border-subtle
  - `e2` popover: `0 4px 16px rgb(0 0 0 / .32)` + border-strong
  - `e3` modal: `0 16px 48px rgb(0 0 0 / .48)` + 1px accent-soft outer ring
  - Light mode swaps to softer, larger-radius shadows (`rgb(10 10 15 / .06–.12)`).

## 5. Motion

Framer Motion presets exported from `@flowpilot/ui/motion`:

| Token | Spec | Use |
|---|---|---|
| `ease-out-fast` | 150ms, `cubic-bezier(0.16, 1, 0.3, 1)` | Hovers, toggles, tooltips |
| `ease-out-base` | 200ms, same curve | Dropdowns, popovers, tab switches |
| `ease-out-slow` | 250ms, same curve | Modals, slide-overs (work item panel) |
| `spring-subtle` | `{ type:'spring', stiffness: 380, damping: 30 }` | Kanban drag-drop settle, OTP error shake, checkmark morph |
| `ai-stream` | opacity 0→1 per token batch, 120ms | Copilot text streaming |

Rules: transform/opacity only (no layout-property animation); entrances animate, exits are faster (×0.7 duration); list items stagger ≤ 30ms, cap 8 items; `prefers-reduced-motion` collapses everything to 80ms fades.

## 6. Component Inventory

All components extend shadcn/ui primitives; package `@flowpilot/ui`.

- **Button** — variants: `primary` (accent fill), `secondary` (surface + border), `ghost`, `danger`, `ai` (gradient-ai fill, used only for copilot CTAs). Sizes 28/32/36px. Loading state swaps label for spinner, keeps width.
- **Card** — `e1`, `--r-lg`, 16px padding; interactive cards gain border-strong + 1px translateY on hover.
- **Badge** — `micro` type, `-soft` bg + `-border`, 6px radius; StatusBadge and PriorityBadge encode the §2 mapping and are the only legal way to render status/priority.
- **Avatar** — 20/24/28px circles, deterministic hue from user id for initials; AvatarStack overlaps −6px, `+N` overflow chip.
- **Input / Textarea / Select / Combobox** — 36px, `--r-md`, border-strong on hover, 2px accent focus ring at 40% alpha; inline error uses `--danger` + `small` helper text. Command palette (⌘K) is a full-screen Combobox at `e3`.
- **KanbanCard** — `--r-lg` card: PriorityBadge + key (`FLOW-214`, mono `small`), title (`body-strong`, 2-line clamp), footer: labels, due chip (warning when < 3 days), estimate, Avatar. Drag: `spring-subtle` lift, `e2`, 3° tilt; AI-suggested placement shows a dashed gradient-ai outline until approved.
- **CopilotPanel** — right dock 380px, `--r-xl` inner surface, gradient-ai top hairline. Contains MessageList (streaming), **ActionCard** (tool-approval: summary line, expandable args diff, Approve `ai` button / Edit / Dismiss), context chip row showing what the copilot can see.
- **Toast** — bottom-right, `e2`, auto-dismiss 5s, holds the 30s Undo action for AI mutations.
- **DataTable / BurndownChart / VelocityBars** — tabular-nums, semantic colors only for semantic meaning (never decorative), accent reserved for the "predicted" series.
- **EmptyState** — icon, one sentence, one primary CTA + one "Ask the copilot" ghost button (`02-ux-flows.md` §10).

## 7. Layout & Iconography

**App shell grid:** left nav 240px (collapsible to 64px icon rail) · content fluid, max-width 1440px · copilot dock 380px (overlay below 1280px viewport). Content columns on a 12-col grid, 24px gutters. Board columns fixed 320px with horizontal scroll. Breakpoints: `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536` (Tailwind defaults).

**Icons:** Lucide, 16px in rows/buttons, 20px in nav, 1.5px stroke, `currentColor` only. AI features use exactly one glyph (`sparkles`) — tinted with `--gradient-ai` via mask, never animated except a single 200ms fade-in when the copilot starts responding.

## 8. Theming Implementation

Tokens live in `packages/ui/tokens.css`; themes switch by class on `<html>` (`next-themes`, default `dark`, respects system):

```css
:root { --bg-base: 255 255 255; --accent: 99 102 241; /* … */ }
.dark { --bg-base: 10 10 15; /* … */ }
```

```ts
// tailwind.config.ts (excerpt)
colors: {
  base:    'rgb(var(--bg-base) / <alpha-value>)',
  surface: 'rgb(var(--bg-surface) / <alpha-value>)',
  accent:  'rgb(var(--accent) / <alpha-value>)',
  success: 'rgb(var(--success) / <alpha-value>)', // + warning, danger, info
}
```

Rules: components may only use token classes (`bg-surface`, `text-secondary`) — raw hex in `apps/web` fails a lint rule; charts read the same variables at render time so both themes come free (`dataviz` layer included).

## 9. Data Visualization Palette

Charts (burndown, velocity, forecast) use a restrained sub-palette so semantic colors keep their meaning:

| Series role | Token | Notes |
|---|---|---|
| Actual / primary series | `--text-secondary` line, `--accent-soft` area | Neutral by default |
| Predicted / AI series | `--accent`, dashed | Accent is the AI's color |
| Good threshold / done | `--success` | Only for genuinely positive values |
| At-risk band | `--warning` @ 12% fill | Background band, never a line |
| Overdue / blocked | `--danger` | Sparingly |
| Comparison (prev. sprint) | `--text-tertiary`, dotted | Always the quietest series |

Gridlines `--border-subtle`, axis text `small`/`--text-tertiary`, tabular-nums everywhere; tooltips are `e2` popovers reusing the standard Card. Series are additionally distinguished by dash/shape so color is never the only signal (§11).

## 10. Component States & Content Voice

Every interactive component defines all six states — default, hover, focus-visible, active, disabled (40% opacity, no hover), loading — in its story; Chromatic snapshots both themes. Destructive confirmation is inline (button morphs to "Confirm delete?") rather than modal for single-item actions; modals reserved for multi-item destruction.

Voice: sentence case everywhere (buttons included), verbs first ("Create project", not "New project creation"), no exclamation marks in UI chrome, numerals not words ("3 blockers"). The copilot speaks in first person, plain and brief; it says "I couldn't…" and offers the next step — never blames the user, never apologizes twice.

## 11. Accessibility (WCAG 2.1 AA)

- Contrast: text ≥ 4.5:1, large text/icons ≥ 3:1 — token pairs in §2 are pre-verified in both themes (`--text-secondary` on `--bg-surface` = 4.6:1 dark / 4.9:1 light); CI runs axe-core + a token-contrast unit test.
- Full keyboard operability: visible 2px focus ring (accent, 2px offset) on every interactive element; roving tabindex in board columns; drag-and-drop has keyboard equivalent (`Space` pick up, arrows move, `Space` drop) via dnd-kit.
- Color is never the sole signal: status badges pair color with label text; charts add pattern/shape for series.
- Live regions: copilot streaming uses `aria-live="polite"`; toasts `role="status"`; approval cards trap focus like dialogs.
- Targets ≥ 40×40px on touch; `prefers-reduced-motion` honored (§5); all media (meeting audio) paired with transcripts by design.
- Screen-reader labels for icon-only buttons enforced by lint rule (`eslint-plugin-jsx-a11y` + custom rule for our Button `iconOnly` prop requiring `aria-label`).
