# Veritas UI Elements Guide

> Reference for implementing the Veritas design system in the web application.

---

## 1. Buttons

### Primary Button
- **Background:** `#B33A3A` (Scripture Red)
- **Text:** White (`#FFFFFF`)
- **Font:** Inter, 600 (SemiBold), 16px
- **Padding:** 12px 24px
- **Border radius:** 8px
- **Hover:** `#992E2E` (darken 10%)
- **Active:** `#7A2323` (darken 20%)
- **Disabled:** `#D4A0A0` (30% opacity feel)
- **Transition:** 150ms ease
- **Shadow (optional):** `0 1px 3px rgba(0,0,0,0.12)`

```
/* CSS */
.btn-primary {
  background-color: #B33A3A;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 150ms ease;
}
.btn-primary:hover { background-color: #992E2E; }
.btn-primary:active { background-color: #7A2323; }
.btn-primary:disabled { background-color: #D4A0A0; cursor: not-allowed; }
```

### Secondary Button
- **Background:** White (`#FFFFFF`)
- **Border:** `#C5943A` (Gold Leaf), 2px solid
- **Text:** `#C5943A` (Gold Leaf)
- **Font:** Inter, 600, 16px
- **Padding:** 10px 22px (2px less to account for border)
- **Border radius:** 8px
- **Hover:** Background `#FFF8E7` (Highlight)
- **Active:** Background `#F0E6CC`

### Ghost / Text Button
- **Background:** transparent
- **Text:** `#4A8DB7` (Sky Blue)
- **Font:** Inter, 500, 16px
- **Padding:** 8px 16px
- **Hover:** Background `#F0F5FA`
- **Underline on hover:** yes

### CTA Button (Marketing)
- **Background:** `#C5943A` (Gold Leaf) or `#B33A3A` (Scripture Red)
- **Text:** White, 18px, Inter 600
- **Padding:** 16px 32px
- **Border radius:** 10px
- **Subtle glow on hover:** box-shadow `0 4px 12px rgba(197, 148, 58, 0.3)`

---

## 2. Cards

### Standard Card
- **Background:** White (`#FFFFFF`)
- **Border:** `#E2DCD3` (Subtle Border), 1px solid
- **Border radius:** 12px
- **Padding:** 24px
- **Shadow:** `0 1px 3px rgba(0,0,0,0.06)`, `0 1px 2px rgba(0,0,0,0.04)`
- **Hover (interactive cards):** Shadow `0 4px 12px rgba(0,0,0,0.08)`, translateY(-2px)

```
/* CSS */
.card {
  background: #FFFFFF;
  border: 1px solid #E2DCD3;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
}
```

### Featured / Highlight Card (Pricing)
- Same as standard card, plus:
- **Top border:** 3px solid `#C5943A` (Gold Leaf)
- **Badge:** "Most Popular" — Gold Leaf background, white text, rounded pill

### Callout / Blockquote Card
- **Background:** `#FFF8E7` (Highlight)
- **Left border:** 4px solid `#C5943A` (Gold Leaf)
- **Border radius:** 8px
- **Padding:** 16px 20px

### Result Card (Answer Display)
- **Background:** White
- **Left border:** 4px solid `#C5943A` (Gold Leaf) for primary answer
- **Section dividers:** 1px `#E2DCD3` between sections
- **Source citation:** Small text (`#8B8980`), linked in Sky Blue

---

## 3. Form Elements

### Text Input
- **Background:** White (`#FFFFFF`)
- **Border:** `#E2DCD3` (Subtle Border), 1.5px solid
- **Text:** `#1A1B23`, Inter 400, 16px
- **Placeholder:** `#8B8980` (Muted Text)
- **Padding:** 12px 16px
- **Border radius:** 8px
- **Focus:** Border `#C5943A` (Gold Leaf), ring shadow `0 0 0 3px rgba(197, 148, 58, 0.15)`
- **Error:** Border `#B33A3A`, error message in Scripture Red below
- **Disabled:** Background `#F7F5F0`, text `#B5B0A0`
- **Success (form complete):** Border `#3A7D5C`

```
/* CSS */
.input {
  background: #FFFFFF;
  border: 1.5px solid #E2DCD3;
  border-radius: 8px;
  padding: 12px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #1A1B23;
  outline: none;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.input::placeholder { color: #8B8980; }
.input:focus {
  border-color: #C5943A;
  box-shadow: 0 0 0 3px rgba(197, 148, 58, 0.15);
}
.input--error { border-color: #B33A3A; }
.input--error:focus { box-shadow: 0 0 0 3px rgba(179, 58, 58, 0.15); }
```

### Search / Query Input (Primary Feature)
- **Background:** White or Parchment White
- **Border:** `#E2DCD3`, 2px
- **Text:** 18px (larger for primary query input)
- **Icon:** Search or lightbulb icon in Muted Text on left side
- **Padding:** 16px 20px 16px 52px (with icon)
- **Border radius:** 12px (larger for emphasis)
- **Focus:** Gold Leaf border, subtle gold ring
- **Shadow:** `0 2px 8px rgba(0,0,0,0.06)`

### Select / Dropdown
- Same as text input
- **Chevron:** Custom SVG in Gold Leaf or Muted Text
- **Option hover:** `#FFF8E7` (Highlight)

### Checkbox / Toggle
- **Checkbox:** 20x20px, border `#E2DCD3`, radius 4px
- **Checked:** Background `#C5943A`, white checkmark
- **Label:** Inter 400, 16px, 8px gap
- **Toggle:** 44x24px track, border radius 12px, off: `#E2DCD3`, on: `#3A7D5C`
- **Toggle knob:** 20x20px white circle

---

## 4. Chat Interface (Answer Display)

### Chat Bubble — User
- **Background:** `#1E293B` (Deep Indigo)
- **Text:** White
- **Font:** Inter 400, 16px
- **Border radius:** 16px 16px 4px 16px
- **Padding:** 12px 16px
- **Max width:** 70%
- **Alignment:** Right

### Chat Bubble — Veritas
- **Background:** `#F7F5F0` (Parchment White)
- **Text:** `#1A1B23`
- **Border:** 1px `#E2DCD3`
- **Border radius:** 16px 16px 16px 4px
- **Padding:** 16px 20px
- **Max width:** 85%
- **Alignment:** Left
- **Source indicator:** Small gold dot + source citation at bottom

### Chat Input Bar
- **Background:** White
- **Top border:** 1px `#E2DCD3`
- **Padding:** 16px 24px
- **Input:** Borderless, 16px, full-width
- **Send button:** Gold Leaf circle with white arrow icon

### Loading / Typing Indicator
- Three dots, Gold Leaf (`#C5943A`)
- Pulsing animation (opacity 0.3 → 1.0)
- Container: small rounded pill, Parchment White background

---

## 5. Navigation

### Top Navigation (Marketing Site)
- **Background:** White or transparent
- **Sticky:** Yes, with subtle shadow on scroll
- **Logo:** Left, compact version
- **Links:** Inter 500, 16px, Deep Indigo
- **Active link:** Gold Leaf underline
- **CTA button:** Right side

### Sidebar (Application)
- **Background:** `#1E293B` (Deep Indigo)
- **Text:** White, Inter 400, 15px
- **Active item:** Gold Leaf left border, background `rgba(197,148,58,0.1)`
- **Divider:** `rgba(255,255,255,0.08)`
- **Width:** 260px (collapsible to 60px)

---

## 6. Typography in UI

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| App title (sidebar) | EB Garamond | 22px | 700 | White |
| Section heading | EB Garamond | 20px | 600 | #1A1B23 |
| Answer heading | EB Garamond | 18px | 600 | #1A1B23 |
| Body text | Inter | 16px | 400 | #1A1B23 |
| Small text | Inter | 14px | 400 | #8B8980 |
| Bible verse | JetBrains Mono | 14px | 400 | #8B8980 |
| Source citation | Inter | 13px | 400 | #4A8DB7 |

---

## 7. Spacing System

Use a 4px baseline grid:

| Token | Pixels | Usage |
|-------|--------|-------|
| xs | 4px | Internal icon margins |
| sm | 8px | Tight spacing between inline elements |
| md | 12px | Between label and input |
| lg | 16px | Between cards, standard padding |
| xl | 24px | Section padding, card padding |
| xxl | 32px | Between major sections |
| xxxl | 48px | Page section margins |
| hero | 80px | Hero section top/bottom padding |

---

## 8. Shadows

| Level | Usage | Value |
|-------|-------|-------|
| 1 | Cards, subtle depth | `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` |
| 2 | Hover cards, dropdowns | `0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06)` |
| 3 | Modals, dialogs | `0 10px 30px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)` |
| 4 | Gold glow (CTA emphasis) | `0 4px 16px rgba(197, 148, 58, 0.25)` |

---

## 9. Responsive Breakpoints

| Breakpoint | Width | Notes |
|------------|-------|-------|
| Mobile | < 640px | Single column, reduced padding |
| Tablet | 640px - 1024px | 2-column grid, sidebar collapsible |
| Desktop | > 1024px | Full layout, 260px sidebar |

---

## 10. Accessibility Notes

- All touch targets minimum 44x44px
- Color contrast ratios meet WCAG AA:
  - Text on Parchment White: 4.8:1+ (Deep Indigo)
  - Text on Deep Indigo: 9.5:1+ (White)
  - Gold Leaf on White: 2.6:1 (for decorative only — use Dark Gold `#8B6914` for text)
- Focus indicators visible (gold ring on inputs, blue ring as fallback)
- Motion in `prefers-reduced-motion`: 0 transition duration

---

*Version 1.0 — Aligned with Veritas Brand Guide*