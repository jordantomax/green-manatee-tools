import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import renderWithProviders from '@/test-utils/renderWithProviders'
import { faker } from '@faker-js/faker'
import InventoryRestockRec from '../InventoryRestockRec'
import { toLocationLabel } from '@/utils/format'
import api from '@/api'

vi.mock('@/api')

const setup = (props = {}) => {
  const location = faker.helpers.arrayElement(['fba', 'awd'])
  
  const defaultProps = {
    location,
    locationLabel: toLocationLabel(location),
    recommendation: {
      product: {
        id: faker.string.uuid(),
        sku: faker.string.alphanumeric(10),
        name: faker.commerce.productName()
      },
      cartonTemplateId: faker.string.uuid(),
      cartonUnitQty: faker.number.int({ min: 1, max: 100 }),
      restock: {
        fba: {
          restockQty: faker.number.int({ min: 1, max: 1000 })
        },
        awd: {
          restockQty: faker.number.int({ min: 1, max: 1000 })
        }
      },
      sales: {
        amzUnitSalesBy30DayPeriods: faker.helpers.arrayElements([1, 2, 3, 4, 5, 6, 7, 8, 9], { min: 1, max: 9 }),
        amzWeightedMonthlyGrowthRate: faker.number.float({ min: -1, max: 1 }),
        amzProjectedMonthlyUnitSales: faker.number.int({ min: 0, max: 10000 })
      },
      fba: {
        stock: faker.number.int({ min: 0, max: 10000 }),
        inbound: faker.number.int({ min: 0, max: 10000 })
      },
      awd: {
        stock: faker.number.int({ min: 0, max: 10000 }),
        inbound: faker.number.int({ min: 0, max: 10000 })
      },
      warehouse: {
        stock: faker.number.int({ min: 0, max: 10000 })
      }
    },
    onDone: vi.fn(),
    ...props
  }
  
  renderWithProviders(<InventoryRestockRec {...defaultProps} />)
  
  return defaultProps
}

describe('InventoryRestockRec', () => {

  describe('when creating shipment', () => {
    it('sets cartonQty to Math.ceil(restockQty/cartonUnitQty) + 1', async () => {
      const mockCreateOutShipment = vi.fn().mockResolvedValue({})
      api.createOutShipment = mockCreateOutShipment

      const { recommendation, location } = setup()

      const button = screen.getByText(`Create ${toLocationLabel(location)} Shipment`)
      fireEvent.click(button)

      await waitFor(() => {
        const expectedCartonQty = Math.ceil(recommendation.restock[location].restockQty / recommendation.cartonUnitQty) + 1
        expect(mockCreateOutShipment).toHaveBeenCalledWith(
          recommendation,
          location,
          expectedCartonQty
        )
      })
    })
  })
})

