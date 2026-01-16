## 2024-05-22 - LocalStorage Deserialization Vulnerability
**Vulnerability:** The application was using `JSON.parse()` directly on data retrieved from `localStorage` without any validation or error handling.
**Learning:** Client-side storage is an external input source and should be treated as untrusted. Malformed JSON or unexpected data structures (e.g., from user tampering or browser issues) can cause the application to crash or behave unpredictably.
**Prevention:** Always wrap `JSON.parse` in a `try-catch` block and use a schema validation library like `zod` to verify the structure and types of the parsed data before using it. Use `z.coerce.date()` to handle date strings serialized in JSON.
