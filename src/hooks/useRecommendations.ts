"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Recommendation, Book, ReadingStatus } from "@/types"
import { useLocalStorage } from "./useLocalStorage"
import { useUser } from "./useUser"

export interface UseRecommendationsReturn {
  recommendations: Recommendation[]
  savedRecIds: string[]
  hiddenRecIds: string[]
  lessLikeRecIds: string[]
  loading: boolean
  error: string | null
  save: (id: string) => Promise<void>
  hide: (id: string) => void
  lessLike: (id: string) => void
  savedRecBooks: (existingBookTitles: string[]) => Book[]
}

export function useRecommendations(): UseRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, updateUser } = useUser()

  const [hiddenRecIds, setHiddenRecIds] = useLocalStorage<string[]>("bookcase_hidden_recs", [])
  const [lessLikeRecIds, setLessLikeRecIds] = useLocalStorage<string[]>("bookcase_lesslike_recs", [])

  useEffect(() => {
    fetch("/api/recommendations")
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load recommendations (${r.status})`)
        return r.json()
      })
      .then(setRecommendations)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const savedRecIds = useMemo(() => user?.savedRecIds ?? [], [user?.savedRecIds])

  // Avoid stale closure: derive next state from current savedRecIds at call time
  const save = useCallback(async (id: string) => {
    const current = user?.savedRecIds ?? []
    const next = current.includes(id)
      ? current.filter((r) => r !== id)
      : [...current, id]
    await updateUser({ savedRecIds: next })
  }, [user?.savedRecIds, updateUser])

  const hide = useCallback((id: string) => {
    setHiddenRecIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    const current = user?.savedRecIds ?? []
    if (current.includes(id)) {
      updateUser({ savedRecIds: current.filter((r) => r !== id) })
    }
  }, [user?.savedRecIds, setHiddenRecIds, updateUser])

  const lessLike = useCallback((id: string) => {
    setLessLikeRecIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    const current = user?.savedRecIds ?? []
    if (current.includes(id)) {
      updateUser({ savedRecIds: current.filter((r) => r !== id) })
    }
  }, [user?.savedRecIds, setLessLikeRecIds, updateUser])

  const savedRecBooks = useCallback((existingBookTitles: string[]): Book[] => {
    return savedRecIds
      .map((id) => {
        const rec = recommendations.find((r) => r.id === id)
        if (!rec || existingBookTitles.includes(rec.title)) return null
        return {
          id: `rec-${rec.id}`,
          userId: "anon",
          title: rec.title,
          author: rec.author,
          genre: "Recommendation",
          status: "Want to Read" as ReadingStatus,
          rating: null,
          progress: 0,
          spine: rec.spine,
          tag: "Saved",
          notes: "",
          addedAt: new Date().toISOString().split("T")[0],
          finishedAt: null,
        }
      })
      .filter(Boolean) as Book[]
  }, [savedRecIds, recommendations])

  return {
    recommendations,
    savedRecIds,
    hiddenRecIds,
    lessLikeRecIds,
    loading,
    error,
    save,
    hide,
    lessLike,
    savedRecBooks,
  }
}
