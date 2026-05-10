"use client";

import { useCallback, useState } from "react";

const KEY = "bookcase_authenticated";

export function useSession() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(KEY) === "true";
  });

  const login = useCallback(() => {
    localStorage.setItem(KEY, "true");
    setAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEY);
    setAuthenticated(false);
  }, []);

  return { authenticated, login, logout };
}
