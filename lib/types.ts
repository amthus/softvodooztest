export interface Bookshelf {
  _id?: string
  id?: string
  name?: string
  title?: string
  description?: string
  slug?: string
  createdAt?: string
  updatedAt?: string
  last_modified?: number
  user?: any
}

export interface BookForm {
  _id?: string
  id?: string
  title: string
  authors?: Author[]
  cover?: string
  price?: number
  averageRating?: number
  isbn?: string
  description?: string
  publishedDate?: string
  pageCount?: number
  language?: string
}

export interface Author {
  name: string
  _id?: string
  id?: string
}

export interface ApiResponse<T> {
  data: T
  total?: number
  offset?: number
  limit?: number
}

export interface PaginationParams {
  offset?: number
  limit?: number
}

export interface SearchFilters {
  query?: string
  author?: string
  minRating?: number
  maxPrice?: number
}
