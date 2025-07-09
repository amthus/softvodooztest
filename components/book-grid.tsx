"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, User, DollarSign, Loader2, BookOpen, Calendar, Globe } from "lucide-react"
import Image from "next/image"
import type { BookForm } from "@/lib/types"

interface BookGridProps {
  books: BookForm[]
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  totalBooks?: number
}

function BookSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-muted" />
      <CardContent className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="flex justify-between">
          <div className="h-3 bg-muted rounded w-1/4" />
          <div className="h-3 bg-muted rounded w-1/4" />
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
        <BookOpen className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Aucun livre trouve</h3>
      <p className="text-muted-foreground">Cette etagere ne contient aucun livre pour le moment.</p>
    </div>
  )
}

function BookCard({ book }: { book: BookForm }) {
  const [imageError, setImageError] = useState(false)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
      <div className="aspect-[3/4] relative bg-muted overflow-hidden">
        {book.cover && !imageError ? (
          <Image
            src={book.cover || "/placeholder.svg"}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            onError={() => setImageError(true)}
            loading="lazy"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-muted-foreground/10 rounded-lg flex items-center justify-center">
                <BookOpen className="h-8 w-8" />
              </div>
              <p className="text-sm">Pas de couverture</p>
            </div>
          </div>
        )}

        {book.averageRating && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/70 text-white border-0">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
              {book.averageRating.toFixed(1)}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold line-clamp-2 mb-1 group-hover:text-primary transition-colors" title={book.title}>
            {book.title}
          </h3>

          {book.authors && book.authors.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="line-clamp-1" title={book.authors.map((author) => author.name).join(", ")}>
                {book.authors.map((author) => author.name).join(", ")}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          {book.price && (
            <Badge variant="outline" className="text-xs">
              <DollarSign className="h-3 w-3 mr-1" />
              {typeof book.price === "object" && book.price.amount
                ? (book.price.amount / 100).toFixed(0)
                : typeof book.price === "number"
                  ? book.price.toFixed(0)
                  : book.price}
              €
            </Badge>
          )}

          {book.language && (
            <Badge variant="outline" className="text-xs">
              <Globe className="h-3 w-3 mr-1" />
              {book.language.toUpperCase()}
            </Badge>
          )}
        </div>

        {book.publishedDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {new Date(book.publishedDate).getFullYear()}
          </div>
        )}

        {book.description && (
          <p className="text-xs text-muted-foreground line-clamp-2" title={book.description}>
            {book.description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function BookGrid({ books, loading, hasMore, onLoadMore, totalBooks = 0 }: BookGridProps) {
  if (loading && books.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <BookSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (!loading && books.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalBooks} livre{totalBooks > 1 ? "s" : ""} dans cette etagere
        </p>
        {loading && books.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement...
          </div>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {books.map((book) => (
          <BookCard key={book._id || book.id} book={book} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={onLoadMore}
            disabled={loading}
            variant="outline"
            size="lg"
            className="min-w-[200px] bg-transparent"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Chargement...
              </>
            ) : (
              "Charger plus de livres"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
