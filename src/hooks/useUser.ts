"use client"

import { useState, useEffect, useCallback } from "react"
import { User } from "@/types"

interface UseUserReturn {
  user: User | null
  loading: boolean
  error: string | null
  updateUser: (patch: Partial<Omit<User, "id" | "totalBooks">>) => Promise<void>
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/user")
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load user (${r.status})`)
        return r.json()
      })
      .then(setUser)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const updateUser = useCallback(async (patch: Partial<Omit<User, "id" | "totalBooks">>) => {
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Unknown error" }))
      throw new Error(err.error ?? `Failed to update user (${res.status})`)
    }
    const updated = await res.json()
    setUser(updated)
  }, [])

  return { user, loading, error, updateUser }
}
