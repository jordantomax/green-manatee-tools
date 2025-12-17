import { describe, it, expect } from 'vitest'
import { Table } from '@mantine/core'
import renderWithProviders from '@/test-utils/renderWithProviders'
import StickyHeaderTable from '../StickyHeaderTable'

const setup = () => {
  const theadRef = { current: null }
  const table = (
    <Table>
      <Table.Thead ref={theadRef}>
        <Table.Tr>
          <Table.Th className="th-1 th-2">Column 1</Table.Th>
          <Table.Th>Column 2</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td>Data 1</Table.Td>
          <Table.Td>Data 2</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  )
  
  return { ...renderWithProviders(
    <StickyHeaderTable 
      theadRef={theadRef}>{table}
    </StickyHeaderTable>
    ), theadRef }
}

describe('StickyHeaderTable', () => {

  describe('when cloning th elements', () => {
    it('preserves className from original th elements', () => {
      const { container } = setup()
      const stickyTh = container.querySelector('table th')
      expect(stickyTh).toHaveClass('th-1', 'th-2')
    })
  })
})

