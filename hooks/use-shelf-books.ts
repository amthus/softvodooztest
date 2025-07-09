"use client"

import { useState, useEffect, useCallback } from "react"
import { bookshelfService } from "@/lib/api"
import type { BookForm, PaginationParams } from "@/lib/types"

interface UseShelfBooks {
  books: BookForm[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
  totalBooks: number
}

export function useShelfBooks(shelfId: string | null, pageSize = 12): UseShelfBooks {
  const [books, setBooks] = useState<BookForm[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const [totalBooks, setTotalBooks] = useState(0)

  const fetchBooks = useCallback(
    async (params: PaginationParams, append = false) => {
      if (!shelfId) {
        setBooks([])
        setHasMore(false)
        setTotalBooks(0)
        setLoading(false)
        setError(null)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const formIds = await bookshelfService.getShelfBooks(shelfId, params)

        if (formIds.length === 0) {
          if (!append) {
            setBooks([])
            setTotalBooks(0)
          }
          setHasMore(false)
          return
        }

        const booksData = await bookshelfService.getBooksDetails(formIds)

        setBooks((prev) => {
          const newBooks = append ? [...prev, ...booksData] : booksData
          setTotalBooks(newBooks.length)
          return newBooks
        })

        setHasMore(formIds.length === pageSize)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des livres")
      } finally {
        setLoading(false)
      }
    },
    [shelfId, pageSize],
  )

  const loadMore = useCallback(() => {
    if (!loading && hasMore && shelfId) {
      const newOffset = offset + pageSize
      setOffset(newOffset)
      fetchBooks({ offset: newOffset, limit: pageSize }, true)
    }
  }, [loading, hasMore, offset, pageSize, shelfId, fetchBooks])

  const refresh = useCallback(() => {
    if (shelfId) {
      setOffset(0)
      setBooks([])
      setTotalBooks(0)
      fetchBooks({ offset: 0, limit: pageSize }, false)
    }
  }, [shelfId, pageSize, fetchBooks])

  useEffect(() => {
    setOffset(0)
    setBooks([])
    setTotalBooks(0)
    setHasMore(true)
    setError(null)

    if (shelfId) {
      fetchBooks({ offset: 0, limit: pageSize }, false)
    } else {
      setLoading(false)
    }
  }, [shelfId, pageSize, fetchBooks])

  return {
    books,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    totalBooks,
  }
}
