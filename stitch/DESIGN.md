# Design System Strategy: Analytical Ethereality

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"Analytical Ethereality."** 

We are moving away from the cold, industrial feel of traditional logic-based interfaces and toward a high-end, editorial experience. This system balances the rigid precision of data with the fluid sophistication of deep violet and lavender. We break the "template" look by favoring **intentional asymmetry** and **tonal depth** over rigid grids. Layouts should feel curated, utilizing breathing room (negative space) and overlapping elements to create a sense of architectural layers rather than flat rows.

## 2. Colors & Surface Philosophy
The palette transitions from deep, authoritative violets to soft, airy lavenders, creating a spectrum of intellectual energy.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Boundaries must be defined solely through background color shifts. Use `surface-container-low` for secondary sections sitting on a `surface` background. 

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine, semi-translucent paper.
- **Base:** `surface` (#fef7ff)
- **Primary Layout Containers:** `surface-container-low` (#f9f1ff)
- **Interactive Elevated Elements:** `surface-container-lowest` (#ffffff)
- **Inactive/Recessed Elements:** `surface-container-high` (#ede5f3)

### The "Glass & Gradient" Rule
To escape the "SaaS-standard" look, floating elements (modals, popovers) must utilize **Glassmorphism**. Apply `surface` at 80% opacity with a `backdrop-blur` of 12px-16px. 
**Signature Texture:** Use a subtle linear gradient (45-degree) from `primary` (#5300b7) to `primary_container` (#6d28d9) for primary CTAs and hero state indicators to provide a "lit-from-within" professional polish.

## 3. Typography: The Editorial Voice
We use **Manrope** across all scales, leaning into its geometric but humanistic qualities.

*   **Display (lg/md/sm):** These are your "Brand Moments." Use `display-lg` (3.5rem) with tighter letter-spacing (-0.02em) to create high-impact, editorial headers.
*   **Headlines & Titles:** Use `headline-md` (1.75rem) for section entries. These should feel authoritative and provide an anchor for the eye amidst the purple tonal shifts.
*   **Body (lg/md/sm):** Use `body-md` (0.875rem) for most data-heavy contexts to maintain "Analytical Precision." 
*   **Labels:** `label-md` and `label-sm` should be used exclusively for metadata and micro-copy, set in `on_surface_variant` (#4a4455) to reduce visual noise.

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often a crutch for poor layout. In this system, depth is achieved through **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural lift without the need for high-contrast lines.
*   **Ambient Shadows:** For high-elevation elements (Floating Action Buttons or Modals), use extra-diffused shadows.
    *   *Spec:* `0px 12px 32px rgba(83, 0, 183, 0.06)` — Note the use of a violet tint in the shadow to mimic natural light passing through the purple palette.
*   **The "Ghost Border" Fallback:** If containment is strictly required for accessibility, use a "Ghost Border": `outline-variant` (#ccc3d7) at **15% opacity**. Never use 100% opaque borders.

## 5. Components & Interaction Patterns

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `on_primary` text. Radius: `DEFAULT` (1rem).
- **Secondary:** `surface-container-highest` background with `primary` text. No border.
- **Tertiary:** No background. `primary` text. Use for low-priority actions.

### Cards & Lists
- **The Forbiddance:** Never use divider lines between list items. Use `spacing-4` (1rem) or `spacing-6` (1.5rem) of vertical white space to separate content. 
- **Interaction:** On hover, a card should shift from `surface-container-lowest` to `surface-bright` with a soft ambient shadow.

### Input Fields
- **Default State:** Background: `surface-container-low`. No border.
- **Focus State:** Background: `surface-container-lowest`. 2px "Ghost Border" using `primary` at 40% opacity.
- **Error State:** `error` (#ba1a1a) text labels with `error_container` soft background wash.

### Specialized Logic Components
- **Node Connections:** Instead of thin black lines, use `outline_variant` (#ccc3d7) with a 2px width and `full` rounding for path endings.
- **Status Chips:** Use `secondary_container` (#8455ef) for "Active" states and `tertiary_fixed_dim` (#c7c4d8) for "Draft/Pending" to maintain the sophisticated violet-grey balance.

## 6. Do’s and Don’ts

### Do
- **Do** embrace white space. If a layout feels "full," increase the spacing between tiers.
- **Do** use `primary_fixed_dim` (#d3bbff) for large background washes where you want to emphasize a specific workspace.
- **Do** ensure all "Analytical" data (numbers/tables) are perfectly aligned, but set within asymmetrical containers to maintain the editorial feel.

### Don't
- **Don't** use pure black (#000000) for text. Use `on_surface` (#1d1a24) to keep the palette soft.
- **Don't** use standard 1px grey dividers. If you must separate, use a background color change or a wide gutter.
- **Don't** use "Alert Red" for everything. Use the `error` tokens sparingly to ensure they maintain their "Warning" significance against the dominant purple.

---
**Director's Note:** This system is about the *intent* behind the purple. It is not just a color change; it is a shift from a "utility tool" to a "command center." Every pixel should feel like it was placed with surgical precision, yet floating within a dreamlike, sophisticated atmosphere.