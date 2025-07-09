import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import HomePage from "@/app/page"
import { bookshelfService } from "@/lib/api"
import jest from "jest"

jest.mock("@/lib/api")
const mockBookshelfService = bookshelfService as jest.Mocked<typeof bookshelfService>

describe("Integration Tests - Flux Utilisateur Complet", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("Scénario complet : Navigation étagères → livres → recherche", async () => {
    const mockShelves = [
      { _id: "shelf1", name: "Fiction", description: "Mes romans favoris" },
      { _id: "shelf2", name: "Tech", description: "Livres techniques" },
    ]
    mockBookshelfService.getBookshelves.mockResolvedValue(mockShelves)

    const mockFormIds = ["form1", "form2", "form3"]
    mockBookshelfService.getShelfBooks.mockResolvedValue(mockFormIds)

    const mockBooks = [
      {
        _id: "form1",
        title: "Harry Potter",
        authors: [{ name: "J.K. Rowling" }],
        price: 15.99,
        cover: "cover1.jpg",
      },
      {
        _id: "form2",
        title: "JavaScript Guide",
        authors: [{ name: "Douglas Crockford" }],
        price: 25.5,
        cover: "cover2.jpg",
      },
    ]
    mockBookshelfService.getBookDetails
      .mockResolvedValueOnce(mockBooks[0])
      .mockResolvedValueOnce(mockBooks[1])

    render(<HomePage />)

    await waitFor(() => {
      expect(screen.getByText("Fiction")).toBeInTheDocument()
      expect(screen.getByText("Tech")).toBeInTheDocument()
    })

    fireEvent.click(screen.getAllByText("Voir les livres")[0])

    await waitFor(() => {
      expect(screen.getByText("Harry Potter")).toBeInTheDocument()
      expect(screen.getByText("JavaScript Guide")).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText("Rechercher des livres...")
    fireEvent.change(searchInput, { target: { value: "harry" } })

    await waitFor(() => {
      expect(screen.getByText("Harry Potter")).toBeInTheDocument()
      expect(screen.queryByText("JavaScript Guide")).not.toBeInTheDocument()
    })

    expect(screen.getByText('1 livre(s) trouvé(s) pour "harry"')).toBeInTheDocument()
  })

  test("Gestion d'erreur API", async () => {
    mockBookshelfService.getBookshelves.mockRejectedValue(new Error("Network error"))

    render(<HomePage />)

    await waitFor(() => {
      expect(screen.getByText("Erreur de connexion")).toBeInTheDocument()
      expect(screen.getByText("Network error")).toBeInTheDocument()
    })
  })
})
