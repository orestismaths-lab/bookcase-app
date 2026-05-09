"use client"

import { useState, useEffect } from "react"
import { ReadingStats } from "@/types"

interface UseStatsReturn {
  stats: ReadingStats | null
  loading: boolean
}

export function useStats(): UseStatsReturn {
  const [stats, setStats] = useState<ReadingStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  return { stats, loading }
}
