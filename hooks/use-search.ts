"use client"

import { useMemo } from "react"
import type { BookForm, SearchFilters } from "@/lib/types"

interface UseSearch {
  filteredBooks: BookForm[]
  resultCount: number
  hasResults: boolean
}

export function useSearch(books: BookForm[], filters: SearchFilters): UseSearch {
  const filteredBooks = useMemo(() => {
    if (!filters.query && !filters.author && !filters.minRating && !filters.maxPrice) {
      return books
    }

    return books.filter((book) => {
      if (filters.query) {
        const searchTerm = filters.query.toLowerCase()
        const titleMatch = book.title?.toLowerCase().includes(searchTerm)
        const authorMatch = book.authors?.some((author) => author.name?.toLowerCase().includes(searchTerm))
        if (!titleMatch && !authorMatch) return false
      }

      if (filters.author) {
        const authorMatch = book.authors?.some((author) =>
          author.name?.toLowerCase().includes(filters.author!.toLowerCase()),
        )
        if (!authorMatch) return false
      }

      if (filters.minRating && book.averageRating) {
        if (book.averageRating < filters.minRating) return false
      }

      if (filters.maxPrice && book.price) {
        if (book.price > filters.maxPrice) return false
      }

      return true
    })
  }, [books, filters])

  return {
    filteredBooks,
    resultCount: filteredBooks.length,
    hasResults: filteredBooks.length > 0,
  }
}
