import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
  const [stored, setStored] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStored(JSON.parse(item) as T);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const next = value instanceof Function ? value(stored) : value;
        setStored(next);
        if (typeof window !== "undefined") {
          const serialized = JSON.stringify(next);
          window.localStorage.setItem(key, serialized);
          window.dispatchEvent(
            new StorageEvent("storage", { key, newValue: serialized }),
          );
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, stored],
  );

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) return;
      try {
        setStored(JSON.parse(e.newValue) as T);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);

  return [stored, setValue];
}
