# InDiiServe Site Audit Report (Feb 2026)

This report details the identified issues across the codebase and live site, categorized by severity.

## 🔴 Critical Issues (Fix ASAP)
1.  **Admin Panel Crash**: Accessing `/admin/dashboard` or `/admin/blogs` results in a client-side exception.
    *   *Cause*: Likely hydration mismatch or invalid `rolePermissions` lookup.
    *   *Fix*: Implement a `mounted` guard in `AdminLayout` and `AuthGuard`.
2.  **Hydration Mismatches**: Widespread across the site.
    *   *Cause*: Conditional rendering based on `localStorage` or `pathname` without waiting for client-side mount.
    *   *Fix*: Standardize the `useIsMounted` pattern.

## 🟡 Major Issues (Functional/UI)
1.  **Preloader Hangs**: The site sometimes stays stuck at 0% or 100%.
    *   *Cause*: `setIsLoading(false)` is tied to a complex GSAP timeline that may not trigger properly if interrupted.
    *   *Fix*: Add a failsafe timeout to the loader.
2.  **GSAP "Null Target" Warnings**: Flooding the console.
    *   *Cause*: Animations targeting elements that are not yet rendered or are conditionally hidden.
    *   *Fix*: Add existence checks before initiating animations.
3.  **Terminology Inconsistency**:
    *   *Issue*: Admin sidebar says "Logistics" while the home page targets "Digital Marketing".
    *   *Fix*: Synchronize all brand terminology to "Strategic Consulting" or "Business Solutions".

## 🟢 Minor Issues (Polish/SEO)
1.  **Blog Content Casing**: Titles in the blog feed are inconsistently cased (e.g., all lowercase).
2.  **Image Optimization**: Missing `sizes` and `priority` attributes on LCP images (Hero sections).
3.  **Technical Labels**: "Node Credentials Trace" in admin login is too technical/confusing.

---

## 🛠 Proposed Implementation Plan

### Phase 1: Stability & Hydration
- Implement `useIsMounted` in all client components.
- Fix `AdminLayout` to prevent crash on mount.
- Add failsafe for `PageLoader`.

### Phase 2: Animation & Performance
- Clean up GSAP targets in `Navbar` and `Hero`.
- Add `priority` to hero images.
- Fix preloader timing.

### Phase 3: Content & UX Polish
- Standardize branding terminology.
- Fix blog feed casing.
- Clean up admin UI technical labels.
