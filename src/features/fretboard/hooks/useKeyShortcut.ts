import { useEffect } from "react";

/**
 * Fires `handler` when the given keyboard `key` is pressed at the window level.
 * `enabled` lets callers gate the listener without unmounting.
 */
export function useKeyShortcut(
  key: string,
  handler: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === key) {
        e.preventDefault();
        handler();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key, handler, enabled]);
}
