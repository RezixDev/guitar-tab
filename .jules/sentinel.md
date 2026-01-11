## 2025-01-11 - Robust LocalStorage Parsing
**Vulnerability:** Application crash (DoS) when `localStorage` contains invalid JSON or unexpected data structures.
**Learning:** `JSON.parse` throws synchronously and `localStorage` is mutable by the user, making it an untrusted input source.
**Prevention:** Always wrap `JSON.parse` in `try-catch` blocks and validate the structure of parsed data before use. Use a helper function like `safeParse`.
