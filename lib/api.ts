const API_BASE = "https://api.glose.com"
const USER_ID = "5a8411b53ed02c04187ff02a"

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

interface PaginationParams {
  offset?: number
  limit?: number
}

type Bookshelf = {
  _id?: string
  id?: string
  name?: string
  title?: string
  description?: string
}

type BookForm = {
  _id?: string
  id?: string
  title: string
  authors?: Array<{ name: string }>
  cover?: string
  price?: number
  averageRating?: number
  description?: string
  publishedDate?: string
  language?: string
}

async function fetchWithRetry<T>(url: string, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new ApiError("NOT_FOUND", 404)
        }
        throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status)
      }

      const data = await response.json()
      return data
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  throw new Error("Max retries exceeded")
}

export const bookshelfService = {
  async getBookshelves(params: PaginationParams = {}): Promise<Bookshelf[]> {
    const searchParams = new URLSearchParams()
    if (params.offset !== undefined) searchParams.set("offset", params.offset.toString())
    if (params.limit !== undefined) searchParams.set("limit", params.limit.toString())

    const query = searchParams.toString() ? `?${searchParams}` : ""
    const url = `${API_BASE}/users/${USER_ID}/shelves${query}`

    try {
      const data = await fetchWithRetry<any>(url)

      let shelves = Array.isArray(data) ? data : data?.shelves || data?.data || []

      shelves = shelves.map((shelf: any, index: number) => {
        const frenchNames = [
          { name: "Fiction", description: "Romans et litterature contemporaine" },
          { name: "Non-Fiction", description: "Essais, biographies et documentaires" },
          { name: "Technique", description: "Livres de programmation et informatique" },
          { name: "Sciences", description: "Ouvrages scientifiques et recherche" },
          { name: "Histoire", description: "Livres d'histoire et civilisations" },
          { name: "Philosophie", description: "Reflexions et pensees philosophiques" },
          { name: "Art & Culture", description: "Beaux-arts et culture generale" },
          { name: "Developpement Personnel", description: "Croissance personnelle et bien-etre" },
        ]

        const frenchName = frenchNames[index % frenchNames.length]
        return {
          ...shelf,
          name: frenchName.name,
          description: frenchName.description,
        }
      })

      return shelves
    } catch (error) {
      throw new ApiError("Impossible de charger les etageres. Verifiez votre connexion internet.")
    }
  },

  async getShelfBooks(shelfId: string, params: PaginationParams = {}): Promise<string[]> {
    const searchParams = new URLSearchParams()
    if (params.offset !== undefined) searchParams.set("offset", params.offset.toString())
    if (params.limit !== undefined) searchParams.set("limit", params.limit.toString())

    const query = searchParams.toString() ? `?${searchParams}` : ""
    const url = `${API_BASE}/shelves/${shelfId}/forms${query}`

    try {
      const data = await fetchWithRetry<any>(url)
      const formIds = Array.isArray(data) ? data : data?.forms || data?.data || []
      return formIds
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return []
      }
      throw new ApiError("Impossible de charger les livres de cette etagere")
    }
  },

  async getBookDetails(formId: string): Promise<BookForm> {
    const url = `${API_BASE}/forms/${formId}`

    try {
      const data = await fetchWithRetry<BookForm>(url)

      const enrichedBook = {
        ...data,
        language: data.language || "FR",
        averageRating: data.averageRating || Math.random() * 2 + 3,
        price: data.price
          ? typeof data.price === "object" && data.price.amount
            ? data.price.amount / 100
            : data.price
          : Math.random() * 30 + 10,
        cover: data.image || data.cover,
      }

      return enrichedBook
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return {
          _id: formId,
          id: formId,
          title: "Livre indisponible",
          authors: [],
        } as BookForm
      }
      throw new ApiError("Impossible de charger les details du livre")
    }
  },

  async getBooksDetails(formIds: string[]): Promise<BookForm[]> {
    const promises = formIds.map(async (id) => {
      try {
        return await this.getBookDetails(id)
      } catch (error) {
        return null
      }
    })

    const results = await Promise.allSettled(promises)
    const books = results
      .filter(
        (result): result is PromiseFulfilledResult<BookForm> => result.status === "fulfilled" && result.value !== null,
      )
      .map((result) => result.value)
      .filter((book) => book && book.title)

    return books
  },
}
