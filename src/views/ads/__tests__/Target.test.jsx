import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import renderWithProviders from '@/test-utils/renderWithProviders'
import { BrowserRouter } from 'react-router-dom'
import { faker } from '@faker-js/faker'
import Target from '../Target'
import api from '@/api'
import { TARGET_STATES } from '@/utils/constants'

vi.mock('@/api')

const mockRun = vi.fn().mockImplementation(async (apiCall) => {
  return await apiCall()
})

vi.mock('@/hooks/useAsync', () => ({
  default: () => ({
    run: mockRun,
    isLoading: false,
    loadingStates: {}
  })
}))

vi.mock('@/hooks/useConfirm', () => ({
  default: () => vi.fn().mockResolvedValue(true)
}))

const setup = (props = {}) => {
  const defaultProps = {
    asin: faker.amazon.asin(),
    targetId: faker.amazon.id(),
    recordsAggregate: {
      campaignId: faker.amazon.id(),
      adGroupId: faker.amazon.id(),
      campaignName: faker.lorem.words(2),
      adGroupName: faker.lorem.words(2)
    },
    ...props
  }
  
  // Mock API responses
  vi.mocked(api.getTarget).mockResolvedValue({ state: 'ENABLED' })
  vi.mocked(api.listNegativeTargets).mockResolvedValue(props.negativeTargets || [])
  vi.mocked(api.archiveTargets).mockResolvedValue({})
  vi.mocked(api.updateTarget).mockResolvedValue({})
  
  renderWithProviders(
    <BrowserRouter>
      <Target {...defaultProps} />
    </BrowserRouter>
  )
}

describe('Target view', () => {

  describe('activeNegativeTarget', () => {

    describe('expression matches and state is not archived', () => {
      it('finds active negative target', async () => {
        const asin = faker.amazon.asin()
        const campaignId = faker.amazon.id()
        const negativeTargets = [{
          expression: [{ value: asin, type: 'ASIN_SAME_AS' }],
          campaignId,
          state: TARGET_STATES.ENABLED
        }]
        
        setup({ 
          asin, 
          negativeTargets,
          recordsAggregate: { campaignId, adGroupId: faker.amazon.id() }
        })
        
        await waitFor(() => {
          expect(screen.getByText('ASIN_SAME_AS')).toBeInTheDocument()
        })
      })
    })

    describe('expression matches and state is archived', () => {
      it('does not find active negative target', async () => {
        const asin = faker.amazon.asin()
        const campaignId = faker.amazon.id()
        const negativeTargets = [{
          expression: [{ value: asin, type: 'ASIN_SAME_AS' }],
          campaignId,
          state: TARGET_STATES.ARCHIVED
        }]
        
        setup({ 
          asin, 
          negativeTargets,
          recordsAggregate: { campaignId, adGroupId: faker.amazon.id() }
        })
        
        await waitFor(() => {
          expect(screen.queryByText('ASIN_SAME_AS')).not.toBeInTheDocument()
        })
      })
    })
  })

  describe('handleStateChange', () => {

    describe('State is ARCHIVED', () => {
      it('Calls archiveTargets with targetId', async () => {
        const targetId = faker.amazon.id()
        setup({ targetId })
        
        const select = screen.getByRole('textbox')
        fireEvent.click(select)
        
        const archivedOption = screen.getByText('Archived')
        fireEvent.click(archivedOption)
        
        await waitFor(() => {
          expect(api.archiveTargets).toHaveBeenCalledWith([targetId])
        })
      })
    })

    describe('State is not ARCHIVED', () => {
      it('Calls updateTarget with state', async () => {
        const targetId = faker.amazon.id()
        setup({ targetId })
        
        const select = screen.getByRole('textbox')
        fireEvent.click(select)
        
        const pausedOption = screen.getByText('Paused')
        fireEvent.click(pausedOption)
        
        await waitFor(() => {
          expect(api.updateTarget).toHaveBeenCalledWith(targetId, { state: TARGET_STATES.PAUSED })
        })
      })
    })
  })
})