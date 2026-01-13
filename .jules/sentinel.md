## 2024-05-22 - LocalStorage JSON Parse Vulnerability
**Vulnerability:** Application crashed when `localStorage` contained malformed JSON or unexpected data structures.
**Learning:** `JSON.parse` throws synchronously and must always be wrapped in `try-catch`.
**Prevention:** Use `zod` schema validation + `try-catch` wrapper for all `localStorage` reads.

## 2024-05-22 - Date Serialization in JSON
**Vulnerability:** Type mismatch between TypeScript interfaces (expecting `Date`) and runtime JSON data (providing `string`).
**Learning:** `JSON.parse` does not restore `Date` objects. `zod` schemas for stored data must accept `string | Date`.
**Prevention:** Use `z.coerce.date()` or `z.string().or(z.date())` when validating objects stored in JSON.
