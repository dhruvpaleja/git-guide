# Design System Audit — Soul Yatri

## Foundation Layer

### Color System
| Token Type | Implementation | Quality |
|-----------|---------------|---------|
| CSS Variables | ✅ Defined in `src/index.css` via `:root` and `.dark` | GOOD |
| HSL Format | ✅ Using `hsl(var(--primary))` pattern | GOOD |
| Dark Mode | ✅ `.dark` class toggles HSL values | GOOD |
| Semantic Tokens | ✅ `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--card`, `--popover`, `--border`, `--input`, `--ring` | EXCELLENT |
| Chart Colors | ✅ `--chart-1` through `--chart-5` defined | GOOD |
| Brand Colors | ⚠️ Some pages use raw hex instead of tokens (`bg-[#f3f3f3]`, `bg-[#F8F9FA]`, `text-[#FF7B00]`) | NEEDS FIX |

**Issues Found:**
- 4 pages bypass design tokens with hardcoded colors (About, Contact, Career, Business)
- Teal accent (`#14B8A6`) used directly instead of via CSS variable
- Orange brand color (`#FF7B00`) not in token system

### Typography
| Element | Implementation | Notes |
|---------|---------------|-------|
| Font Stack | `font-sans` (Tailwind default) | No custom brand font loaded |
| Heading Scale | ✅ Consistent `text-4xl`/`text-3xl`/`text-2xl`/`text-xl` | Via Tailwind |
| Body Text | ✅ `text-base`/`text-sm`/`text-xs` | Consistent |
| Font Weights | ✅ `font-bold`/`font-semibold`/`font-medium` | Consistent |
| Line Height | ✅ Tailwind defaults (`leading-relaxed` used) | Good readability |
| Custom Font | ❌ No `@font-face` or Google Fonts loaded | Using system fonts |

**Recommendation:** Add brand font (e.g., Inter, Plus Jakarta Sans) for visual identity.

### Spacing
| Pattern | Usage | Quality |
|---------|-------|---------|
| Tailwind Scale | ✅ `p-4`, `p-6`, `p-8`, `gap-4`, `gap-6`, `space-y-4` | CONSISTENT |
| Container | ✅ `max-w-7xl mx-auto px-4` pattern | GOOD |
| Section Spacing | ✅ `py-16`/`py-20`/`py-24` for page sections | CONSISTENT |
| Card Padding | ✅ `p-4`/`p-6` standard | CONSISTENT |

### Border Radius
| Element | Value | Quality |
|---------|-------|---------|
| CSS Variable | ✅ `--radius: 0.5rem` defined | GOOD |
| Buttons | ✅ Via `rounded-md` / shadcn default | CONSISTENT |
| Cards | ✅ `rounded-lg` / `rounded-xl` | CONSISTENT |
| Inputs | ✅ `rounded-md` | CONSISTENT |
| Avatars | ✅ `rounded-full` | CONSISTENT |

---

## Component Library

### shadcn/ui Components Inventory

| Component | File Exists | Used In Pages | Quality |
|-----------|-------------|--------------|---------|
| Button | ✅ `src/components/ui/button.tsx` | 25+ pages | EXCELLENT |
| Card | ✅ `card.tsx` | 20+ pages | EXCELLENT |
| Dialog | ✅ `dialog.tsx` | 5+ pages | GOOD |
| Input | ✅ `input.tsx` | 10+ pages | GOOD |
| Label | ✅ `label.tsx` | 8+ pages | GOOD |
| Select | ✅ `select.tsx` | 5+ pages | GOOD |
| Textarea | ✅ `textarea.tsx` | 4+ pages | GOOD |
| Badge | ✅ `badge.tsx` | 8+ pages | GOOD |
| Avatar | ✅ `avatar.tsx` | 6+ pages | GOOD |
| Skeleton | ✅ `skeleton.tsx` | 3+ pages | MODERATE |
| Tabs | ✅ `tabs.tsx` | 4+ pages | GOOD |
| Toast/Sonner | ✅ `sonner.tsx` | Global | GOOD |
| Tooltip | ✅ `tooltip.tsx` | 3+ pages | MODERATE |
| Separator | ✅ `separator.tsx` | 5+ pages | GOOD |
| Progress | ✅ `progress.tsx` | 2+ pages | MODERATE |
| Switch | ✅ `switch.tsx` | 2+ pages | MODERATE |
| Checkbox | ✅ `checkbox.tsx` | 2+ pages | MODERATE |
| Accordion | ✅ `accordion.tsx` | 1+ pages | LOW USE |
| Alert | ✅ `alert.tsx` | 2+ pages | MODERATE |
| Dropdown Menu | ✅ `dropdown-menu.tsx` | 3+ pages | GOOD |
| Sheet | ✅ `sheet.tsx` | 1+ pages | LOW USE |
| Scroll Area | ✅ `scroll-area.tsx` | 2+ pages | MODERATE |
| Form (RHF) | ✅ `form.tsx` | 4+ pages | GOOD |

### Button Variants (CVA)
```
Variants defined in button.tsx:
- default: bg-primary text-primary-foreground
- destructive: bg-destructive text-destructive-foreground
- outline: border border-input bg-background
- secondary: bg-secondary text-secondary-foreground
- ghost: hover:bg-accent hover:text-accent-foreground
- link: text-primary underline-offset-4

Sizes:
- default: h-10 px-4 py-2
- sm: h-9 rounded-md px-3
- lg: h-11 rounded-md px-8
- icon: h-10 w-10
```

**Issues:**
- Some pages create custom button styles instead of using variants
- Landing page CTAs use inline Tailwind instead of Button component
- No `warning` variant for confirmation actions

---

## Layout System

### Grid & Flexbox Usage
| Pattern | Implementation | Consistency |
|---------|---------------|-------------|
| Page Layout | `DashboardLayout` wrapper | ✅ CONSISTENT |
| Content Grid | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` | ✅ CONSISTENT |
| Flex Row | `flex items-center justify-between` | ✅ CONSISTENT |
| Stack | `flex flex-col gap-4` | ✅ CONSISTENT |
| Sidebar | ✅ Collapsible with responsive behavior | GOOD |
| Navbar | ✅ Fixed top with backdrop blur | GOOD |

### Layout Components
| Component | Purpose | Quality |
|-----------|---------|---------|
| MainLayout | Public pages (navbar + footer) | ✅ GOOD |
| DashboardLayout | Auth pages (sidebar + topbar) | ✅ GOOD |
| AuthLayout | Login/Signup (centered card) | ✅ GOOD |
| Sidebar | Dashboard navigation | ✅ GOOD — collapsible, icons, nested items |
| Navbar | Public navigation | ✅ GOOD — responsive hamburger menu |
| Footer | Public footer | ✅ GOOD — links, social, newsletter |

---

## Animation System

### Libraries Used
| Library | Purpose | Pages | Quality |
|---------|---------|-------|---------|
| GSAP + ScrollTrigger | Scroll-driven parallax, pinning | Landing, Wellness sections | EXCELLENT |
| Framer Motion | Page transitions, card animations, hover effects | 20+ pages | EXCELLENT |
| Lottie (lottie-react) | Animated illustrations | Splash, loading | GOOD |
| AOS | Scroll reveal animations | Several sections | GOOD |
| anime.js | Complex path animations | Constellation feature | MODERATE |
| Lenis | Smooth scroll | Global | GOOD |
| CSS Animations | Pulse, glow, caret-blink, shimmer | Various | GOOD |

### Animation Consistency
- ✅ Framer Motion `variants` pattern used consistently
- ✅ `staggerChildren` for list animations
- ✅ `whileHover` and `whileTap` for interactivity
- ⚠️ Too many animation libraries → potential bundle bloat
- ⚠️ No `prefers-reduced-motion` handling detected

---

## Responsive Design

### Breakpoint Coverage
| Breakpoint | Usage | Quality |
|-----------|-------|---------|
| `sm:` (640px) | ✅ Used across all pages | GOOD |
| `md:` (768px) | ✅ Primary layout shift point | GOOD |
| `lg:` (1024px) | ✅ Desktop layout | GOOD |
| `xl:` (1280px) | ✅ Wide desktop | MODERATE (less used) |
| `2xl:` (1536px) | ❌ Not used | N/A |

### Mobile-First Analysis
- ✅ Base styles target mobile
- ✅ Grid columns adjust per breakpoint
- ✅ Navigation collapses to hamburger
- ✅ Touch targets generally 44px+ (Tailwind h-10 = 40px)
- ⚠️ Some text sizes could be larger on small screens

---

## Accessibility

### Current State
| Feature | Status | Notes |
|---------|--------|-------|
| Semantic HTML | ✅ Good | `<nav>`, `<main>`, `<section>`, `<header>`, `<footer>` |
| ARIA Labels | ✅ Moderate | Icon buttons have `aria-label` |
| Focus Styles | ✅ Good | `focus-visible:ring-ring` via shadcn |
| Color Contrast | ⚠️ Unknown | Cannot verify without visual testing |
| Skip to Content | ❌ Missing | No `#main-content` skip link |
| Screen Reader Text | ✅ Present | `sr-only` class used in some places |
| Keyboard Navigation | ⚠️ Partial | Radix components handle this; custom carousels don't |
| prefers-reduced-motion | ❌ Missing | Animations play regardless of preference |
| prefers-color-scheme | ❌ Missing | Theme toggle only; no system detection |

---

## Design System Score

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Color Tokens | 80 | 15% | 12.0 |
| Typography | 65 | 10% | 6.5 |
| Spacing | 90 | 10% | 9.0 |
| Components | 85 | 20% | 17.0 |
| Layout System | 85 | 10% | 8.5 |
| Responsive | 82 | 10% | 8.2 |
| Animations | 78 | 10% | 7.8 |
| Accessibility | 55 | 15% | 8.3 |
| **TOTAL** | | **100%** | **77.3/100** |

### Top 5 Design System Improvements
1. **Add brand font** — Load Inter or Plus Jakarta Sans via Google Fonts
2. **Fix hardcoded colors** — Replace all `bg-[#hex]` with CSS variable tokens
3. **Add skip-to-content link** — Accessibility requirement
4. **Add prefers-reduced-motion** — Respect user animation preference
5. **Create a Storybook** — Document all components with live examples
