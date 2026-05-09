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
  save: (id: string) => Promise<void>
  hide: (id: string) => void
  lessLike: (id: string) => void
  // Returns saved recs as Book objects for the shelf
  savedRecBooks: (existingBookTitles: string[]) => Book[]
}

export function useRecommendations(): UseRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const { user, updateUser } = useUser()

  // Transient UI state — don't need to survive device switches
  const [hiddenRecIds, setHiddenRecIds] = useLocalStorage<string[]>("bookcase_hidden_recs", [])
  const [lessLikeRecIds, setLessLikeRecIds] = useLocalStorage<string[]>("bookcase_lesslike_recs", [])

  useEffect(() => {
    fetch("/api/recommendations")
      .then((r) => r.json())
      .then(setRecommendations)
      .finally(() => setLoading(false))
  }, [])

  const savedRecIds = useMemo(() => user?.savedRecIds ?? [], [user?.savedRecIds])

  const save = useCallback(async (id: string) => {
    const next = savedRecIds.includes(id)
      ? savedRecIds.filter((r) => r !== id)
      : [...savedRecIds, id]
    await updateUser({ savedRecIds: next })
  }, [savedRecIds, updateUser])

  const hide = useCallback((id: string) => {
    setHiddenRecIds((prev) => [...prev, id])
    // Also unsave if it was saved
    if (savedRecIds.includes(id)) {
      updateUser({ savedRecIds: savedRecIds.filter((r) => r !== id) })
    }
  }, [savedRecIds, setHiddenRecIds, updateUser])

  const lessLike = useCallback((id: string) => {
    setLessLikeRecIds((prev) => [...prev, id])
    if (savedRecIds.includes(id)) {
      updateUser({ savedRecIds: savedRecIds.filter((r) => r !== id) })
    }
  }, [savedRecIds, setLessLikeRecIds, updateUser])

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
    save,
    hide,
    lessLike,
    savedRecBooks,
  }
}
