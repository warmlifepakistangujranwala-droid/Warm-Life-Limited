# Coding Standards

## Commenting Rule

All important files, components, functions, APIs and CSS sections must contain useful comments.

Comments must explain purpose or reasoning. They must not repeat obvious syntax.

## TypeScript File Header

```ts
/**
 * ============================================================
 * Warm Life Ltd
 * File: Example.tsx
 * Purpose: Explain the responsibility of this file.
 * ============================================================
 */
```

## Function Documentation

```ts
/**
 * Fetches published services in display order.
 *
 * @returns A list of published services.
 */
export async function getPublishedServices() {
  // Implementation
}
```

## Component Documentation

```tsx
/**
 * Renders the homepage certification logo carousel.
 * Content and slider settings are managed from the admin panel.
 */
export function CertificationSlider() {
  return null;
}
```

## CSS Sections

```css
/* ==========================================================
   MOBILE NAVIGATION
   ========================================================== */
```

## General Rules

- Use TypeScript strict typing.
- Avoid `any` unless a documented exception is required.
- Keep components focused.
- Extract repeated logic.
- Validate all admin input.
- Never expose secrets to browser code.
- Use semantic HTML.
- Maintain keyboard accessibility.
- Prefer controlled design options over unrestricted styling.
- Use clear names instead of abbreviations.
