# Luxe Design System — LocationVoiture

> Quality Target: Lovable.dev / Linear / Vercel Dashboard  
> Theme: Midnight Luxe (Dark-only, blue-undertone)  
> Typography: Inter + JetBrains Mono  
> Framework: Tailwind CSS v4 + shadcn/ui

---

## Color Tokens

### Backgrounds (Elevation Layers)
| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--lx-canvas` | hsl(240, 6%, 4%) | `#09090b` | Page body, base |
| `--lx-surface` | hsl(240, 6%, 8%) | `#131316` | Cards, sidebar |
| `--lx-elevated` | hsl(240, 5%, 12%) | `#1c1c21` | Modals, hover cards |
| `--lx-overlay` | hsl(240, 5%, 16%) | `#26262c` | Dropdowns, tooltips |
| `--lx-highlight` | hsl(240, 4%, 20%) | `#303036` | Active/selected |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| `--lx-text` | `#fafafa` | Headings, values |
| `--lx-text-secondary` | `#a1a1aa` | Labels, descriptions |
| `--lx-text-tertiary` | `#71717a` | Placeholders |
| `--lx-text-disabled` | `#4e4e56` | Disabled |

### Accents
| Token | Hex | Usage |
|-------|-----|-------|
| `--lx-accent` | `#3b82f6` | Primary action |
| `--lx-accent-hover` | `#2563eb` | Primary hover |
| `--lx-success` | `#22c55e` | Success states |
| `--lx-warning` | `#f59e0b` | Warning states |
| `--lx-danger` | `#ef4444` | Error/danger |

### Borders
| Opacity | Usage |
|---------|-------|
| `white/[0.06]` | Subtle dividers |
| `white/[0.10]` | Default card borders |
| `white/[0.16]` | Hover state borders |

---

## Typography

**Font**: Inter (Google Fonts) — `-apple-system` fallback  
**Mono**: JetBrains Mono  
**Arabic**: Cairo

| Role | Class | Size | Weight |
|------|-------|------|--------|
| Display | `text-4xl tracking-tight font-bold` | 36px | 700 |
| H1 | `text-2xl tracking-tight font-semibold` | 24px | 600 |
| H2 | `text-lg tracking-tight font-semibold` | 18px | 600 |
| Body | `text-sm font-normal` | 14px | 400 |
| Caption | `text-xs font-medium` | 12px | 500 |
| Micro | `text-[11px] font-medium` | 11px | 500 |

---

## Spacing

All spacing uses **4px/8px grid**:
- Card padding: `p-6` (24px)
- Section gap: `gap-6` (24px) or `gap-8` (32px)
- Page padding: `p-4 sm:p-6 lg:p-8`
- Inline gap: `gap-2` (8px) or `gap-3` (12px)

---

## Border Radius

| Element | Class | Pixels |
|---------|-------|--------|
| Large containers | `rounded-2xl` | 16px |
| Cards | `rounded-2xl` | 16px |
| Buttons, inputs | `rounded-xl` | 12px |
| Badges, tags | `rounded-full` | Pill |
| Small chips | `rounded-lg` | 8px |

---

## Shadows

| Level | Value |
|-------|-------|
| xs | `0 1px 2px rgba(0,0,0,0.2)` |
| sm | `0 2px 8px rgba(0,0,0,0.25)` |
| md | `0 4px 16px rgba(0,0,0,0.3)` |
| lg | `0 8px 32px rgba(0,0,0,0.4)` |
| glow | `0 0 20px rgba(59,130,246,0.15)` |

---

## Transitions

All interactive elements: `transition-all duration-200 ease-out`  
Card hover: `hover:-translate-y-0.5`  
Button press: `active:scale-[0.98]`  
Focus ring: `focus-visible:ring-2 focus-visible:ring-blue-500/40`  
Page entry: `animate-in fade-in slide-in-from-bottom-2 duration-500`
