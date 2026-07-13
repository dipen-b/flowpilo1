# FlowPilot — Design System

Inspiration: Linear's density, Notion's calm, Stripe's precision.
Implementation: Tailwind CSS v4 with CSS custom properties as the token layer
(`src/app/globals.css`), toggled by a `.dark` class on `<html>` (persisted in
`localStorage`, system-preference default).

## Color tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#fafaf9` | `#0b0d12` | page background |
| `--surface` | `#ffffff` | `#12151c` | cards, panels |
| `--surface-2` | `#f4f4f5` | `#191d26` | wells, hovers, column bodies |
| `--ink` | `#0b0b0f` | `#f4f4f5` | primary text |
| `--ink-2` / `--ink-3` | zinc 600 / 400 | zinc 400 / 600 | secondary / muted |
| `--brand` → `--brand-2` | `#6366f1` → `#8b5cf6` | `#818cf8` → `#a78bfa` | indigo→violet gradient, CTAs, active nav |
| `--good / --warn / --critical` | green/amber/red steps | re-stepped for dark | status only — never series colors |

### Chart palette (colorblind-safe, validated)

Series tokens `--series-1…5` (blue, aqua, yellow, violet, red) are stepped per mode and
validated for adjacent-pair CVD separation and surface contrast on both themes. Rules:
one hue per series fixed in order; sequential data (heatmap) uses a single blue ramp;
status colors are never reused as series; sub-3:1 light-mode series always get direct
labels.

## Typography

Geist Sans (UI) / Geist Mono (keys, numbers) via `next/font`. Scale: 12/13px dense UI,
14px body, 20–24px page titles, 48–72px landing hero. `tabular-nums` on all metric
numbers (`.tabular`).

## Shape & elevation

- Radius: 16px cards (`.card`), 10–12px controls, full-round pills/avatars
- Borders: hairline `--border` (8% ink); elevation via `--shadow` / `--shadow-lg`
- Glass top bar: `backdrop-filter: blur(16px)` over 78% bg (`.glass`)

## Motion

- 150–250ms `ease-out` for entrances (`float-up` keyframe, Framer Motion variants)
- Layout animation on Kanban cards (`motion.div layout`)
- Hover: 1px translate-y + shadow bump on interactive cards; 150ms
- Drawer/modal: 180–220ms slide/scale with `AnimatePresence` exits

## Component inventory (`src/components/`)

| Component | File | Notes |
|---|---|---|
| Card, Stat, Progress, badges (Risk/Priority/Status), Avatar, AvatarStack | `ui.tsx` | Avatar accepts any `{id,name,initials,color}` |
| Charts: HealthRing, Sparkline, Burndown, VelocityBars, WorkloadHeatmap | `charts.tsx` | pure SVG, no chart library |
| AppShell (sidebar, topbar, user menu), Logo, ThemeToggle | `shell.tsx` | |
| CommandPalette (⌘K) | `command-palette.tsx` | debounced `/api/search` |
| TaskModal (create), TaskDetail (edit/delete drawer) | `task-modal.tsx`, `task-detail.tsx` | |
| ProjectDetail (board/list/timeline/calendar + DnD) | `project-detail.tsx` | |
| AuthFrame | `auth-frame.tsx` | shared login/signup chrome |

## Accessibility

- WCAG AA contrast on text tokens in both themes
- Focus-visible outlines on interactive elements; `aria-label` on icon buttons
- Charts carry `role="img"` + `aria-label`; data also available as text (tables/labels)
- Hit targets ≥ 32px; keyboard: ⌘K palette, Esc closes overlays
