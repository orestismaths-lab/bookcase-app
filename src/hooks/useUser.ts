"use client"

import { useState, useEffect, useCallback } from "react"
import { User } from "@/types"

interface UseUserReturn {
  user: User | null
  loading: boolean
  updateUser: (patch: Partial<Omit<User, "id" | "totalBooks">>) => Promise<void>
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then(setUser)
      .finally(() => setLoading(false))
  }, [])

  const updateUser = useCallback(async (patch: Partial<Omit<User, "id" | "totalBooks">>) => {
    const updated = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).then((r) => r.json())
    setUser(updated)
  }, [])

  return { user, loading, updateUser }
}
