import { render, screen, fireEvent } from "@testing-library/react"
import { BookshelfList } from "@/components/bookshelf-list"
import type { Bookshelf } from "@/lib/types"
import { jest } from "@jest/globals"

const mockBookshelves: Bookshelf[] = [
  {
    _id: "1",
    name: "Fiction",
    description: "My favorite fiction books",
  },
  {
    _id: "2",
    name: "Technical",
    description: "Programming and tech books",
  },
]

describe("BookshelfList", () => {
  const mockOnSelectShelf = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render bookshelves correctly", () => {
    render(<BookshelfList bookshelves={mockBookshelves} onSelectShelf={mockOnSelectShelf} />)

    expect(screen.getByText("Fiction")).toBeInTheDocument()
    expect(screen.getByText("Technical")).toBeInTheDocument()
    expect(screen.getByText("My favorite fiction books")).toBeInTheDocument()
    expect(screen.getByText("Programming and tech books")).toBeInTheDocument()
  })

  it("should call onSelectShelf when clicking on a shelf", () => {
    render(<BookshelfList bookshelves={mockBookshelves} onSelectShelf={mockOnSelectShelf} />)

    fireEvent.click(screen.getAllByText("Voir les livres")[0])

    expect(mockOnSelectShelf).toHaveBeenCalledWith(mockBookshelves[0])
  })

  it("should show loading skeleton when loading", () => {
    render(<BookshelfList bookshelves={[]} onSelectShelf={mockOnSelectShelf} loading={true} />)

    const skeletons = document.querySelectorAll(".animate-pulse")
    expect(skeletons.length).toBeGreaterThan(0)
  })
})
