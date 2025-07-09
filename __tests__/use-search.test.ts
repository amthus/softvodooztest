import { renderHook } from "@testing-library/react"
import { useSearch } from "@/hooks/use-search"
import type { BookForm } from "@/lib/types"

const mockBooks: BookForm[] = [
  {
    _id: "1",
    title: "JavaScript: The Good Parts",
    authors: [{ name: "Douglas Crockford" }],
  },
  {
    _id: "2",
    title: "Clean Code",
    authors: [{ name: "Robert C. Martin" }],
  },
  {
    _id: "3",
    title: "The Pragmatic Programmer",
    authors: [{ name: "Andy Hunt" }, { name: "Dave Thomas" }],
  },
]

describe("useSearch", () => {
  it("should return all books when query is empty", () => {
    const { result } = renderHook(() => useSearch(mockBooks, ""))

    expect(result.current.filteredBooks).toEqual(mockBooks)
    expect(result.current.isSearching).toBe(false)
  })

  it("should filter books by title", () => {
    const { result } = renderHook(() => useSearch(mockBooks, "javascript"))

    expect(result.current.filteredBooks).toHaveLength(1)
    expect(result.current.filteredBooks[0].title).toBe("JavaScript: The Good Parts")
  })

  it("should filter books by author name", () => {
    const { result } = renderHook(() => useSearch(mockBooks, "martin"))

    expect(result.current.filteredBooks).toHaveLength(1)
    expect(result.current.filteredBooks[0].title).toBe("Clean Code")
  })

  it("should be case insensitive", () => {
    const { result } = renderHook(() => useSearch(mockBooks, "CLEAN"))

    expect(result.current.filteredBooks).toHaveLength(1)
    expect(result.current.filteredBooks[0].title).toBe("Clean Code")
  })

  it("should return empty array when no matches found", () => {
    const { result } = renderHook(() => useSearch(mockBooks, "nonexistent"))

    expect(result.current.filteredBooks).toHaveLength(0)
  })
})
