import { Text, Table } from '@mantine/core'
import { useEffect, useState } from 'react'
import { startCase } from 'lodash-es'

import styles from '@/styles/RecordTable.module.css'

const orderColumns = (columns, order) => {
  if (order && Array.isArray(order)) {
    const orderedColumns = order.filter(col => columns.includes(col))
    const remainingColumns = columns.filter(col => !order.includes(col))
    return [...orderedColumns, ...remainingColumns]
  }
  return columns
}

function RecordTable({ data, columnOrder }) {
  const [columns, setColumns] = useState([])
  
  useEffect(() => {
    let columns = Object.keys(data[0] || {})
    columns = orderColumns(columns, columnOrder)
    setColumns(columns)
  }, [data, columnOrder])

  if (data.length === 0) {
    return <Text>No records found</Text>
  }
  
  return (
    <Table highlightOnHover size="sm">
      <Table.Thead className={styles.stickyRow}>
        <Table.Tr>
          {columns.map((column, colIdx) => (
            <Table.Th 
              className={colIdx === 0 ? styles.stickyCol : styles.th}
              key={column}>
              {startCase(column)}
            </Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {data.map((row, rowIdx) => (
          <Table.Tr className={styles.row} key={rowIdx}>
            {columns.map((column, colIdx) => (
              <Table.Td 
                className={colIdx === 0 ? styles.stickyCol : styles.td}
                key={`${rowIdx}-${column}`}
              >
                <Text size="xs">{row[column]}</Text>
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}

export default RecordTable