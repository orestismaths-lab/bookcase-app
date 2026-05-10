"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "bookcase_authenticated";

function subscribe(cb: () => void) {
  window.addEventListener("bookcase-auth", cb);
  return () => window.removeEventListener("bookcase-auth", cb);
}

function getSnapshot() {
  return localStorage.getItem(KEY) === "true";
}

function getServerSnapshot() {
  return false;
}

export function useSession() {
  const authenticated = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const login = useCallback(() => {
    localStorage.setItem(KEY, "true");
    window.dispatchEvent(new Event("bookcase-auth"));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("bookcase-auth"));
  }, []);

  return { authenticated, login, logout };
}
