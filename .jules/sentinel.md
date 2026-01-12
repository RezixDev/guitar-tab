## 2025-02-18 - Client-Side DoS via LocalStorage Corruption
**Vulnerability:** Application crashes when `localStorage` contains malformed JSON, as `JSON.parse` was called without `try-catch` blocks.
**Learning:** In client-side-only architectures where `localStorage` acts as the database, data integrity cannot be guaranteed (user editing, browser bugs, or previous version incompatibilities). Treating it as trusted input leads to crashes.
**Prevention:** All `localStorage` reads must use defensive parsing. Wrap `JSON.parse` in `try-catch` and validate the shape of the returned data before usage. Use strict type guards or schema validation (e.g., Zod) for critical data.
