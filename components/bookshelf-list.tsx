"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, ChevronRight, RefreshCw, Library } from "lucide-react"
import type { Bookshelf } from "@/lib/types"

interface BookshelfListProps {
  bookshelves: Bookshelf[]
  onSelectShelf: (shelf: Bookshelf) => void
  loading?: boolean
  error?: string | null
  hasMore?: boolean
  onLoadMore?: () => void
  onRefresh?: () => void
}

function BookshelfSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-muted rounded-lg" />
              <div className="h-6 bg-muted rounded w-3/4" />
            </div>
            <div className="h-4 bg-muted rounded w-full" />
          </CardHeader>
          <CardContent>
            <div className="h-10 bg-muted rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EmptyState({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
        <Library className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Aucune étagère trouvée</h3>
      <p className="text-muted-foreground mb-6">Impossible de charger vos étagères pour le moment.</p>
      {onRefresh && (
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      )}
    </div>
  )
}

function ErrorState({ error, onRefresh }: { error: string; onRefresh?: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 bg-destructive/10 rounded-full flex items-center justify-center">
        <Library className="h-12 w-12 text-destructive" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-destructive">Erreur de chargement</h3>
      <p className="text-muted-foreground mb-2 font-medium">Impossible de charger les étagères</p>
      <p className="text-sm text-muted-foreground mb-6">{error}</p>
      {onRefresh && (
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      )}
    </div>
  )
}

export function BookshelfList({
  bookshelves,
  onSelectShelf,
  loading,
  error,
  hasMore,
  onLoadMore,
  onRefresh,
}: BookshelfListProps) {
  console.log("COMPONENT BookshelfList: render with", {
    bookshelvesCount: bookshelves.length,
    loading,
    error,
  })

  if (error) {
    return <ErrorState error={error} onRefresh={onRefresh} />
  }

  if (loading && bookshelves.length === 0) {
    return <BookshelfSkeleton />
  }

  if (!loading && bookshelves.length === 0) {
    return <EmptyState onRefresh={onRefresh} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mes Étagères</h2>
          <p className="text-muted-foreground">
            {bookshelves.length} étagère{bookshelves.length > 1 ? "s" : ""} disponible
            {bookshelves.length > 1 ? "s" : ""}
          </p>
        </div>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {bookshelves.map((shelf) => (
          <Card
            key={shelf._id || shelf.id}
            className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <span className="line-clamp-1">{shelf.title || shelf.name}</span>
              </CardTitle>
              {shelf.description && <CardDescription className="line-clamp-2">{shelf.description}</CardDescription>}
            </CardHeader>
            <CardContent>
              <Button
                variant="ghost"
                className="w-full justify-between group-hover:bg-muted/50"
                onClick={() => {
                  console.log("COMPONENT BookshelfList: Button clicked for shelf", shelf)
                  console.log("COMPONENT BookshelfList: Shelf ID:", shelf.id || shelf._id)
                  onSelectShelf(shelf)
                }}
              >
                Voir les livres
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-6">
          <Button onClick={onLoadMore} disabled={loading} variant="outline" size="lg">
            {loading ? "Chargement..." : "Charger plus d'étagères"}
          </Button>
        </div>
      )}
    </div>
  )
}
