## 2025-01-14 - LocalStorage Data Integrity
**Vulnerability:** Client-side application crashed when `localStorage` data was malformed or manually edited, due to missing `try-catch` and type validation.
**Learning:** Even in client-side only apps, `localStorage` is "user input" and must be treated as untrusted. `JSON.parse` is dangerous without wrappers.
**Prevention:** Always wrap `JSON.parse` in `try-catch` and use a schema validator (like Zod) to verify the shape of the data before using it.
