/**
 * Responsive Design Guide and Best Practices
 * Reference documentation for building responsive Soul Yatri components
 */

# Responsive Design Guidelines

## 🎯 Core Principles

1. **Mobile First**: Design for mobile, then enhance for larger screens
2. **Progressive Enhancement**: Basic functionality works everywhere
3. **Touch Friendly**: Minimum 44px touch targets on mobile
4. **Performance**: Avoid layout shift and excessive reflows
5. **Accessibility**: Ensure responsive design works with screen readers

## 📱 Breakpoints

```
Mobile:    < 640px  (phones)
Tablet:    640px - 1024px (tablets)
Desktop:   >= 1024px (desktops)
```

## 📐 Typography Scale

### Headings (Mobile → Tablet → Desktop)
- **H1**: text-2xl → text-3xl → text-5xl (24px → 30px → 48px)
- **H2**: text-lg → text-2xl → text-4xl (18px → 24px → 36px)
- **H3**: text-base → text-lg → text-2xl (16px → 18px → 24px)

### Body Text
- **Default**: text-sm → text-base → text-base (14px → 16px → 16px)
- **Small**: text-xs → text-sm → text-sm (12px → 14px → 14px)

## 🎨 Spacing Scale

```
Mobile:  px-4 py-8   (16px x 32px)
Tablet:  px-6 py-12  (24px x 48px)
Desktop: px-8 py-16  (32px x 64px)
```

## 🏗️ Common Responsive Patterns

### Two Column Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
  <div>Column 1</div>
  <div>Column 2</div>
</div>
```

### Three Column Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

### Stack to Horizontal
```tsx
<div className="flex flex-col md:flex-row gap-4 md:gap-8">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Hide/Show Based on Breakpoint
```tsx
<div className="hidden md:block">
  Show only on tablet and desktop
</div>

<div className="md:hidden">
  Show only on mobile
</div>
```

## 🖱️ Responsive Components

### Responsive Navigation
```tsx
import { useBreakpoint } from '@/hooks/responsive.hooks';

export function Navigation() {
  const breakpoint = useBreakpoint();
  
  return breakpoint === 'mobile' ? (
    <MobileNav />
  ) : (
    <DesktopNav />
  );
}
```

### Responsive Hero
```tsx
<section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8">
  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
    Your Heading
  </h1>
  <p className="text-sm sm:text-base md:text-lg mt-4 sm:mt-6">
    Your description
  </p>
</section>
```

### Responsive Card Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
  {cards.map(card => (
    <div key={card.id} className="p-4 sm:p-6 rounded-lg border">
      {/* Card content */}
    </div>
  ))}
</div>
```

## 📸 Responsive Images

### Basic Responsive Image
```tsx
<img 
  src="/image.jpg"
  alt="Description"
  className="w-full h-auto object-cover"
/>
```

### With srcSet
```tsx
<img 
  srcSet="
    /image-mobile.jpg 640w,
    /image-tablet.jpg 1024w,
    /image-desktop.jpg 1920w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 90vw,
    80vw
  "
  src="/image-desktop.jpg"
  alt="Description"
  className="w-full h-auto object-cover"
/>
```

## ⌚ Using Responsive Hooks

### useWindowSize
```tsx
import { useWindowSize } from '@/hooks/responsive.hooks';

export function Component() {
  const { width, isMobile, isTablet } = useWindowSize();
  
  if (isMobile) return <MobileLayout />;
  return <DesktopLayout />;
}
```

### useMediaQuery
```tsx
import { useMediaQuery } from '@/hooks/responsive.hooks';

export function Component() {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  
  return isLargeScreen ? <LargeLayout /> : <SmallLayout />;
}
```

### useOrientation
```tsx
import { useOrientation } from '@/hooks/responsive.hooks';

export function Component() {
  const { isPortrait, isLandscape } = useOrientation();
  
  return isPortrait ? <PortraitLayout /> : <LandscapeLayout />;
}
```

## 🚫 Anti-Patterns

❌ **Bad**: Desktop-first approach
```tsx
className="text-4xl md:text-3xl sm:text-2xl" // Wrong order!
```

✅ **Good**: Mobile-first approach
```tsx
className="text-2xl sm:text-3xl md:text-4xl" // Correct order
```

---

❌ **Bad**: Hardcoded sizes
```tsx
<div style={{ width: '1200px' }}> {/* Not responsive */}
```

✅ **Good**: Responsive sizing
```tsx
<div className="w-full max-w-6xl mx-auto"> {/* Responsive */}
```

---

❌ **Bad**: Too many different paddings
```tsx
className="p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6" {/* Too granular */}
```

✅ **Good**: Consistent spacing scale
```tsx
className="p-4 sm:p-6 md:p-8" {/* Uses spacing scale */}
```

---

❌ **Bad**: Non-touch-friendly buttons
```tsx
<button className="px-2 py-1"> {/* 24px height - too small */}
```

✅ **Good**: Touch-friendly buttons
```tsx
<button className="px-4 py-3 min-h-11"> {/* 44px height minimum */}
```

## 🔍 Testing Responsive Design

### Browser DevTools
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on different device sizes
4. Check breakpoint transitions
5. Test landscape/portrait orientation

### Manual Testing Checklist
- [ ] Mobile: 375px (iPhone SE)
- [ ] Mobile: 414px (iPhone 13)
- [ ] Tablet: 768px (iPad)
- [ ] Tablet: 1024px (iPad Pro)
- [ ] Desktop: 1280px (laptop)
- [ ] Desktop: 1920px (desktop)

### Common Issues to Check
- [ ] Touch targets >= 44px height
- [ ] No horizontal scrolling on mobile
- [ ] Images don't overflow container
- [ ] Text is readable on all sizes
- [ ] Buttons are accessible and clickable
- [ ] No layout shift during loading
- [ ] Proper stacking order on mobile

## 📊 Performance Tips

1. **Lazy Load Images**: Load images only when visible
2. **Responsive Images**: Use srcSet to serve right size
3. **CSS Media Queries**: Prevent unnecessary CSS shipping
4. **Minimize Reflows**: Group DOM changes
5. **Use CSS Grid/Flexbox**: More efficient than floats

## 🎓 Reference Files

- **Constants**: `src/constants/responsive.ts`
- **Hooks**: `src/hooks/responsive.hooks.ts`
- **Components**: Check any section in `src/sections/`
- **Best Practices**: This file

## 📚 Additional Resources

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN: Responsive Web Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev: Responsive Web Design Basics](https://web.dev/responsive-web-design-basics/)
