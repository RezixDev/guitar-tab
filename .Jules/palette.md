# Palette's Journal - Critical Learnings

## 2024-01-17 - Select Item Tooltips
**Learning:** Placing Tooltips inside SelectItems creates a UX trap. The `Select` component often traps focus and manages z-index, causing tooltips to be clipped, unreachable, or to close the dropdown when interacting. Additionally, relying on hover for critical information (like what "Hard Mode" does) excludes keyboard and touch users.
**Action:** Move descriptions out of hidden tooltips and either inline them (if short) or display them persistently below the selection. Always prioritize visible, persistent help text over hidden, hover-only text for settings.
