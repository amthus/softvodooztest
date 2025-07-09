import { bookshelfService, ApiError } from "@/lib/api"
import jest from "jest"

global.fetch = jest.fn()

describe("bookshelfService", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("getBookshelves", () => {
    it("should fetch bookshelves successfully", async () => {
      const mockData = [{ _id: "1", name: "Test Shelf" }]
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      const result = await bookshelfService.getBookshelves()

      expect(fetch).toHaveBeenCalledWith("https://api.glose.com/users/5a8411b53ed02c04187ff02a/shelves")
      expect(result).toEqual(mockData)
    })

    it("should handle API errors", async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(bookshelfService.getBookshelves()).rejects.toThrow(ApiError)
    })

    it("should include pagination parameters", async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

      await bookshelfService.getBookshelves({ offset: 10, limit: 5 })

      expect(fetch).toHaveBeenCalledWith(
        "https://api.glose.com/users/5a8411b53ed02c04187ff02a/shelves?offset=10&limit=5",
      )
    })
  })

  describe("getShelfBooks", () => {
    it("should fetch shelf books successfully", async () => {
      const mockData = ["form1", "form2"]
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      const result = await bookshelfService.getShelfBooks("shelf123")

      expect(fetch).toHaveBeenCalledWith("https://api.glose.com/shelves/shelf123/forms")
      expect(result).toEqual(mockData)
    })
  })

  describe("getBookDetails", () => {
    it("should fetch book details successfully", async () => {
      const mockBook = { _id: "form1", title: "Test Book" }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBook,
      })

      const result = await bookshelfService.getBookDetails("form1")

      expect(fetch).toHaveBeenCalledWith("https://api.glose.com/forms/form1")
      expect(result).toEqual(mockBook)
    })
  })
})
