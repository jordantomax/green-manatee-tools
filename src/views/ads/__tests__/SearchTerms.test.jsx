import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import renderWithProviders from '@/test-utils/renderWithProviders'
import { BrowserRouter } from 'react-router-dom'
import SearchTerms from '../SearchTerms'
import api from '@/api'

vi.mock('@/api')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

const mockRun = vi.fn().mockImplementation(async (apiCall) => {
  return await apiCall()
})

vi.mock('@/hooks/useAsync', () => ({
  default: () => ({
    run: mockRun,
    isLoading: false
  })
}))

vi.mock('@/hooks/useLocalStorage', () => ({
  default: () => [
    {
      dateRange: {
        startDate: '2024-01-01',
        endDate: '2024-01-31'
      },
      page: 1,
      limit: 10,
      totalPages: 1,
      filters: [],
      sorts: []
    },
    vi.fn()
  ]
}))

vi.mock('@/hooks/usePagination', () => ({
  default: () => ({
    page: 1,
    limit: 10,
    handlePageChange: vi.fn(),
    handleLimitChange: vi.fn()
  })
}))

const setup = (searchTerms = []) => {
  vi.clearAllMocks()
  
  vi.mocked(api.getAdsSearchTerms).mockResolvedValue({
    data: searchTerms, pagination: { totalPages: 1 }
  })
  vi.mocked(api.listKeywords).mockResolvedValue([])
  
  renderWithProviders(
    <BrowserRouter>
      <SearchTerms />
    </BrowserRouter>
  )
}

describe('SearchTerms', () => {
  it('navigates to keyword page when keyword row is clicked', async () => {
    const keyword = { searchTerm: 'test product', keywordId: '12345', matchType: 'BROAD' }
    setup([keyword])
    
    const table = await screen.findByRole('table')
    const rows = table.querySelectorAll('tbody tr')
    fireEvent.click(rows[0])
    
    expect(mockNavigate).toHaveBeenCalledWith(
      `/ads/search-terms/${encodeURIComponent(keyword.searchTerm)}?keywordId=${keyword.keywordId}`
    )
  })

  it('navigates to target page when targeting expression row is clicked', async () => {
    const target = { searchTerm: 'asin=B08N5WRWNW', keywordId: '67890', matchType: 'TARGETING_EXPRESSION' }
    setup([target])
    
    const table = await screen.findByRole('table')
    const rows = table.querySelectorAll('tbody tr')
    fireEvent.click(rows[0])
    
    expect(mockNavigate).toHaveBeenCalledWith(
      `/ads/search-terms/${encodeURIComponent(target.searchTerm)}?targetId=${target.keywordId}`
    )
  })
})
