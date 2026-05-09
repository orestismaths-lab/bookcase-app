"use client"

import { useState, useEffect } from "react"
import { ReadingStats } from "@/types"

interface UseStatsReturn {
  stats: ReadingStats | null
  loading: boolean
  error: string | null
}

export function useStats(): UseStatsReturn {
  const [stats, setStats] = useState<ReadingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load stats (${r.status})`)
        return r.json()
      })
      .then(setStats)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { stats, loading, error }
}
