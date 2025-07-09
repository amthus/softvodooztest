"use client"

import { useState, useEffect, useCallback } from "react"
import { bookshelfService } from "@/lib/api"
import type { Bookshelf, PaginationParams } from "@/lib/types"

interface UseBookshelves {
  bookshelves: Bookshelf[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
}

export function useBookshelves(initialLimit = 20): UseBookshelves {
  const [bookshelves, setBookshelves] = useState<Bookshelf[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)

  const fetchBookshelves = useCallback(
    async (params: PaginationParams, append = false) => {
      console.log("HOOK useBookshelves: fetchBookshelves called", params, "append:", append)

      try {
        setLoading(true)
        setError(null)

        const data = await bookshelfService.getBookshelves(params)
        console.log("HOOK useBookshelves: received data", data)

        setBookshelves((prev) => {
          const newShelves = append ? [...prev, ...data] : data
          console.log("HOOK useBookshelves: setting bookshelves", newShelves)
          return newShelves
        })

        setHasMore(data.length === (params.limit || initialLimit))
      } catch (err) {
        console.error("HOOK useBookshelves: error", err)
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des étagères")
      } finally {
        setLoading(false)
      }
    },
    [initialLimit],
  )

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const newOffset = offset + initialLimit
      setOffset(newOffset)
      fetchBookshelves({ offset: newOffset, limit: initialLimit }, true)
    }
  }, [loading, hasMore, offset, initialLimit, fetchBookshelves])

  const refresh = useCallback(() => {
    setOffset(0)
    setBookshelves([])
    fetchBookshelves({ offset: 0, limit: initialLimit }, false)
  }, [initialLimit, fetchBookshelves])

  useEffect(() => {
    console.log("HOOK useBookshelves: useEffect triggered")
    fetchBookshelves({ offset: 0, limit: initialLimit })
  }, [fetchBookshelves, initialLimit])

  console.log("HOOK useBookshelves: current state", {
    bookshelvesCount: bookshelves.length,
    loading,
    error,
    hasMore,
  })

  return {
    bookshelves,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  }
}
