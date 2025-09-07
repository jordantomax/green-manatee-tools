import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { faker } from '@faker-js/faker'
import Target from '../Target'
import api from '@/api'
import { TARGET_STATES } from '@/utils/constants'

vi.mock('@/api')

const mockRun = vi.fn().mockImplementation(async (apiCall) => {
  return await apiCall()
})

vi.mock('@/hooks/useAsync', () => ({
  useAsync: () => ({
    run: mockRun,
    isLoading: false,
    loadingStates: {}
  })
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
  
  render(
    <MantineProvider>
      <BrowserRouter>
        <Target {...defaultProps} />
      </BrowserRouter>
    </MantineProvider>
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
})