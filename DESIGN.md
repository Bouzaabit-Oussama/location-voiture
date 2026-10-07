# Apple Human Interface Guidelines (HIG) — Design System Specification

## 1. Philosophy & Tenets
This application strictly follows Apple's Human Interface Guidelines (HIG) with Cupertino aesthetics:
1. **Deference**: The interface is unobtrusive and defers to content. Fluid, clean, and effortless.
2. **Clarity**: Text is legible at every size, icons are precise, adornments are subtle, and functionality is crystal clear.
3. **Depth**: Visual layers, frosted glass surfaces (`materials`), and realistic specular lighting communicate hierarchy and vitality.

---

## 2. Typography
- **Font Stack**: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "SF Pro", system-ui, sans-serif`
- **Arabic Fallback**: `'Cairo', -apple-system, system-ui, sans-serif`
- **Weights**:
  - Display / Hero Headings: `font-semibold` / `font-bold`, tight tracking (`tracking-tight` / `tracking-tighter`)
  - Section Headers: `text-xl font-semibold text-white/95`
  - Body Text: `text-sm font-normal text-white/75` (high contrast, crisp readability)
  - Secondary / Captions: `text-xs font-medium text-white/45`

---

## 3. Cupertino Color Palette & Materials

### Dark Mode (Default Executive Theme)
- **Base Canvas (System Background)**: `#000000` (Pure OLED Black)
- **Primary Surface (Grouped Background / Cards)**: `#1c1c1e` (Apple SystemGray6 Dark) or `rgba(28, 28, 30, 0.75)` with `backdrop-blur-2xl`
- **Secondary Surface (Elevated / Popovers / Modals)**: `#2c2c2e` (Apple SystemGray5 Dark)
- **Tertiary Surface (Inputs / Hover States)**: `#3a3a3c` / `rgba(255, 255, 255, 0.08)`
- **Dividers & Retina Borders**: `rgba(255, 255, 255, 0.08)` / `border-white/10` (Hairline 1px borders)

### System Accents (Apple HIG Spectrum)
- **System Blue (Primary Action)**: `#0a84ff` (Dark mode Cupertino Blue) / Hover: `#0071e3`
- **System Green (Success / Available)**: `#30d158` (iOS Vivid Green)
- **System Yellow/Amber (Warning / Alert)**: `#ffd60a`
- **System Red (Destructive / Danger)**: `#ff453a`
- **System Indigo / Purple (Special Badges)**: `#5e5ce6`

### Materials & Glassmorphism
- **Apple Vibrancy**:
  - Background: `backdrop-blur-2xl bg-black/70 border border-white/10 shadow-2xl`
  - Card Glass: `backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]`
  - Specular Highlights: subtle top-edge border glow `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]`

---

## 4. Spacing, Radii & Corner Curvature
- **Continuous Corners (Squircle Aesthetic)**:
  - Large Containers & Modals: `rounded-3xl` (24px)
  - Cards & Content Blocks: `rounded-2xl` (16px)
  - Buttons, Inputs & Dropdowns: `rounded-xl` (12px)
  - Tags, Chips & Badges: `rounded-full` (Pill style)
- **Spacing Grid**: Multiples of 4pt / 8pt (p-4, p-6, p-8, gap-3, gap-4, gap-6). Generous breathing room without clutter.

---

## 5. Micro-Interactions & Transitions
- **Button Press Effect**: `active:scale-[0.98] transition-all duration-200 ease-out`
- **Hover Lift / Glow**: Smooth opacity and specular shift (`hover:border-white/20 hover:bg-white/[0.06]`)
- **Focus Rings**: Subtle Apple Glow (`focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500`)

---

## 6. Strict Responsiveness Rules
- **Touch Targets**: Minimum 44x44px clickable area on mobile (`h-11` or `p-2.5`).
- **Sidebar**:
  - Desktop (>= 1024px): Persistent, sleek floating frosted glass sidebar.
  - Mobile (< 1024px): Off-canvas Apple Sheet drawer toggleable via top-bar hamburger button.
- **Data Tables**: Horizontal touch scrolling with sticky headers or responsive stacked cards on mobile screens (`< 640px`).
- **Form Modals**: Full-screen or bottom-sheet behavior on mobile, centered rounded-3xl dialogs on desktop.
