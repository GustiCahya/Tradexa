# Tradexa Design System

This document outlines the visual language and design system used in Tradexa, intended for developers recreating the app in Flutter or other frameworks.

## 1. Color Palette

The application strictly adheres to a premium, dark-mode-first aesthetic.

### Backgrounds & Surfaces
- **App Background:** Solid Black (`#000000` / `bg-black`)
- **Card Surfaces:** Semi-transparent white (`rgba(255, 255, 255, 0.05)` / `bg-white/5`)
- **Card Borders:** Very subtle white (`rgba(255, 255, 255, 0.1)` / `border-white/10`)
- **Subtle Overlays (Hover/Empty states):** `rgba(255, 255, 255, 0.02)` to `rgba(255, 255, 255, 0.1)`

### Typography Colors
- **Primary Text (Headings/Active text):** Solid White (`#FFFFFF` / `text-white`)
- **Secondary Text (Subtitles/Descriptions):** Light Gray (`#9CA3AF` / `text-gray-400`)
- **Muted Text (Table headers/Hints):** Darker Gray (`#6B7280` / `text-gray-500`)

### Accent Colors
Used for specific states, icons, and chart elements.
- **Brand/Primary (Links, Logos, Charts):** Blue-500 (`#3B82F6`) to Blue-400 (`#60A5FA`)
- **Success/Winning/Long (Reduced Stress):** Blue-500 (`#3B82F6`) to Blue-400 (`#60A5FA`)
- **Danger/Losing/Short (Reduced Stress):** Orange-500 (`#F97316`) to Orange-400 (`#FB923C`)
- **Secondary Accents (Mindset, specific charts):** Purple-500 (`#A855F7`) to Purple-400 (`#C084FC`)

*Note on Accents:* When used as backgrounds for badges, use a 10% opacity of the color with a 20% opacity border (e.g., `bg-blue-500/10 border-blue-500/20 text-blue-400`).

## 2. Typography

- **Font Family:** Geist Sans (or Inter as a primary fallback). Ensure the font is a clean, modern sans-serif.
- **Headings:** Bold (`font-weight: 700`), tight tracking (`tracking-tight`).
- **Data/Numbers:** Use monospace fonts for numbers (like PnL and RR) for easy scanning (`font-mono font-bold`).

## 3. UI Components & Layouts

### Forms & Inputs
- **Inputs:** `h-12 w-full bg-white/5 border border-white/10 rounded-lg text-white`.
- **Focus State:** `focus:border-blue-500 focus:ring-1 focus:ring-blue-500`.

### Tables
- **Table Header:** Uppercase, text-xs, text-gray-400, bg-white/5, subtle bottom border.
- **Table Rows:** Hover effect with `bg-white/[0.04]`.
- **Pagination:** Simple Previous/Next buttons with page indicators.

### Micro-Animations
- **Fade In:** Elements should fade in and slide up slightly on mount (`opacity-0 translate-y-4` -> `opacity-100 translate-y-0`).
- **Hover scaling:** Buttons often scale slightly on hover (`hover:scale-105`).
