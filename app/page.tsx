"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Library, AlertCircle, BookOpen } from "lucide-react"
import { BookshelfList } from "@/components/bookshelf-list"
import { BookGrid } from "@/components/book-grid"
import { SearchBar } from "@/components/search-bar"
import { ErrorBoundary } from "@/components/error-boundary"
import { useBookshelves } from "@/hooks/use-bookshelves"
import { useShelfBooks } from "@/hooks/use-shelf-books"
import { useSearch } from "@/hooks/use-search"
import type { Bookshelf, SearchFilters } from "@/lib/types"

export default function HomePage() {
  const [selectedShelf, setSelectedShelf] = useState<Bookshelf | null>(null)
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({})

  const shelfId = selectedShelf?.id || selectedShelf?._id || null

  const {
    bookshelves,
    loading: shelvesLoading,
    error: shelvesError,
    hasMore: shelvesHasMore,
    loadMore: loadMoreShelves,
    refresh: refreshShelves,
  } = useBookshelves(20)

  const {
    books,
    loading: booksLoading,
    error: booksError,
    hasMore: booksHasMore,
    loadMore: loadMoreBooks,
    refresh: refreshBooks,
    totalBooks,
  } = useShelfBooks(shelfId, 12)

  const { filteredBooks, resultCount, hasResults } = useSearch(books, searchFilters)

  const handleSelectShelf = useCallback((shelf: Bookshelf) => {
    setSelectedShelf(shelf)
    setSearchFilters({})
  }, [])

  const handleBackToShelves = useCallback(() => {
    setSelectedShelf(null)
    setSearchFilters({})
  }, [])

  const handleFiltersChange = useCallback((filters: SearchFilters) => {
    setSearchFilters(filters)
  }, [])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              {selectedShelf && (
                <Button variant="ghost" size="sm" onClick={handleBackToShelves}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              )}

              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Library className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {selectedShelf ? selectedShelf.title || selectedShelf.name : "Ma Bibliotheque"}
                  </h1>
                  {selectedShelf?.description && (
                    <p className="text-sm text-muted-foreground">{selectedShelf.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {!selectedShelf ? (
            <BookshelfList
              bookshelves={bookshelves}
              onSelectShelf={handleSelectShelf}
              loading={shelvesLoading}
              error={shelvesError}
              hasMore={shelvesHasMore}
              onLoadMore={loadMoreShelves}
              onRefresh={refreshShelves}
            />
          ) : (
            <div className="space-y-6">
              {(books.length > 0 || Object.keys(searchFilters).length > 0) && (
                <SearchBar
                  filters={searchFilters}
                  onFiltersChange={handleFiltersChange}
                  resultCount={Object.keys(searchFilters).length > 0 ? resultCount : undefined}
                  disabled={booksLoading && books.length === 0}
                />
              )}

              {booksError && (
                <Card className="border-destructive">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-5 w-5" />
                      Erreur de chargement
                    </CardTitle>
                    <CardDescription>Impossible de charger les livres de cette etagere</CardDescription>
                    <CardDescription className="text-sm">{booksError}</CardDescription>
                  </CardHeader>
                </Card>
              )}

              <BookGrid
                books={filteredBooks}
                loading={booksLoading}
                hasMore={booksHasMore && Object.keys(searchFilters).length === 0}
                onLoadMore={loadMoreBooks}
                totalBooks={Object.keys(searchFilters).length > 0 ? resultCount : totalBooks}
              />

              {Object.keys(searchFilters).length > 0 && !hasResults && !booksLoading && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Aucun resultat</h3>
                  <p className="text-muted-foreground mb-6">Aucun livre ne correspond a vos criteres de recherche.</p>
                  <Button onClick={() => setSearchFilters({})} variant="outline">
                    Effacer les filtres
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  )
}
