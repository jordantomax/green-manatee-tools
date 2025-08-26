import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import SearchTerms from '../SearchTerms'

vi.mock('@/api', () => ({
  default: {
    getAdsSearchTerms: vi.fn(),
    listKeywords: vi.fn()
  }
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

const mockRun = vi.fn()
vi.mock('@/hooks/useAsync', () => ({
  useAsync: () => ({
    run: mockRun,
    isLoading: false
  })
}))

vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: () => [
    {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      page: 1,
      limit: 10,
      totalPages: 1,
      filters: []
    },
    vi.fn()
  ]
}))

vi.mock('@/hooks/usePagination', () => ({
  usePagination: () => ({
    page: 1,
    limit: 10,
    handlePageChange: vi.fn(),
    handleLimitChange: vi.fn()
  })
}))

describe('SearchTerms', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockRun.mockImplementation(async (apiCall) => {
      if (apiCall.toString().includes('getAdsSearchTerms')) {
        return {
          data: [
            {
              searchTerm: 'test product',
              keywordId: '12345',
              matchType: 'BROAD'
            },
            {
              searchTerm: 'asin=B08N5WRWNW',
              keywordId: '67890',
              matchType: 'TARGETING_EXPRESSION'
            }
          ],
          pagination: { totalPages: 1 }
        }
      }
      if (apiCall.toString().includes('listKeywords')) {
        return []
      }
      return apiCall()
    })
  })

  it('navigates to keyword page when keyword row is clicked', async () => {
    render(
      <MantineProvider>
        <BrowserRouter>
          <SearchTerms />
        </BrowserRouter>
      </MantineProvider>
    )

    const table = await screen.findByRole('table')
    expect(table).toBeInTheDocument()

    const rows = table.querySelectorAll('tbody tr')
    expect(rows.length).toBeGreaterThan(0)
    
    fireEvent.click(rows[0])

    expect(mockNavigate).toHaveBeenCalledWith(
      '/ads/search-terms/test%20product?keywordId=12345'
    )
  })

  it('navigates to target page when targeting expression row is clicked', async () => {
    render(
      <MantineProvider>
        <BrowserRouter>
          <SearchTerms />
        </BrowserRouter>
      </MantineProvider>
    )

    const table = await screen.findByRole('table')
    expect(table).toBeInTheDocument()

    const rows = table.querySelectorAll('tbody tr')
    expect(rows.length).toBeGreaterThan(1)
    
    fireEvent.click(rows[1])

    expect(mockNavigate).toHaveBeenCalledWith(
      '/ads/search-terms/asin%3DB08N5WRWNW?targetId=67890'
    )
  })
})
