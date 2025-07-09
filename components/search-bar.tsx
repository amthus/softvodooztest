"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X, Filter, Star, DollarSign } from "lucide-react"
import type { SearchFilters } from "@/lib/types"

interface SearchBarProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  resultCount?: number
  disabled?: boolean
}

export function SearchBar({ filters, onFiltersChange, resultCount, disabled }: SearchBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleQueryChange = (query: string) => {
    onFiltersChange({ ...filters, query })
  }

  const handleAuthorChange = (author: string) => {
    onFiltersChange({ ...filters, author })
  }

  const handleMinRatingChange = (minRating: string) => {
    onFiltersChange({ ...filters, minRating: minRating ? Number.parseFloat(minRating) : undefined })
  }

  const handleMaxPriceChange = (maxPrice: string) => {
    onFiltersChange({ ...filters, maxPrice: maxPrice ? Number.parseFloat(maxPrice) : undefined })
  }

  const clearFilters = () => {
    onFiltersChange({})
    setShowAdvanced(false)
  }

  const hasActiveFilters = filters.query || filters.author || filters.minRating || filters.maxPrice

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher par titre ou auteur..."
          value={filters.query || ""}
          onChange={(e) => handleQueryChange(e.target.value)}
          disabled={disabled}
          className="pl-10 pr-20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowAdvanced(!showAdvanced)} className="h-6 px-2">
            <Filter className="h-3 w-3" />
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2">
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {showAdvanced && (
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Auteur</label>
                <Input
                  type="text"
                  placeholder="Nom de l'auteur"
                  value={filters.author || ""}
                  onChange={(e) => handleAuthorChange(e.target.value)}
                  disabled={disabled}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Note minimum
                </label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="0.0"
                  value={filters.minRating || ""}
                  onChange={(e) => handleMinRatingChange(e.target.value)}
                  disabled={disabled}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Prix maximum (€)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={filters.maxPrice || ""}
                  onChange={(e) => handleMaxPriceChange(e.target.value)}
                  disabled={disabled}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {(hasActiveFilters || resultCount !== undefined) && (
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {filters.query && (
              <Badge variant="secondary">
                Recherche: "{filters.query}"
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => handleQueryChange("")}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {filters.author && (
              <Badge variant="secondary">
                Auteur: {filters.author}
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => handleAuthorChange("")}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {filters.minRating && (
              <Badge variant="secondary">
                Note ≥ {filters.minRating}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleMinRatingChange("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {filters.maxPrice && (
              <Badge variant="secondary">
                Prix ≤ {filters.maxPrice}€
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => handleMaxPriceChange("")}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>

          {resultCount !== undefined && (
            <p className="text-sm text-muted-foreground">
              {resultCount} résultat{resultCount > 1 ? "s" : ""} trouvé{resultCount > 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
