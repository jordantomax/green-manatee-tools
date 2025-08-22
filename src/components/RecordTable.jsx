import { Text, Table, Group } from '@mantine/core'
import { useEffect, useState } from 'react'
import { startCase, lowerCase } from 'lodash-es'

import styles from '@/styles/RecordTable.module.css'

const orderColumns = (columns, order) => {
  if (order && Array.isArray(order)) {
    const orderedColumns = order.filter(col => columns.includes(col))
    const remainingColumns = columns.filter(col => !order.includes(col))
    return [...orderedColumns, ...remainingColumns]
  }
  return columns
}

function RecordTable({ 
  data,
  columnOrder,
  handleRowClick,
  stateProp,
  hiddenColumns = []
}) {
  const [columns, setColumns] = useState([])
  
  useEffect(() => {
    let columns = Object.keys(data[0] || {})
    columns = columns.filter(col => col !== stateProp)
    columns = columns.filter(col => !hiddenColumns.includes(col))
    columns = orderColumns(columns, columnOrder)
    setColumns(columns)
  }, [data, columnOrder, stateProp, hiddenColumns])

  if (data.length === 0) {
    return <Text>No records found</Text>
  }
  
  return (
    <Table size="sm">
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
          <Table.Tr className={styles.row} key={rowIdx} onClick={() => handleRowClick(row)}>
            {columns.map((column, colIdx) => (
              <Table.Td 
                className={colIdx === 0 ? styles.stickyCol : styles.td}
                key={`${rowIdx}-${column}`}
              >
                {colIdx === 0 && stateProp ? (
                  <Group gap="xs" align="center" wrap="nowrap">
                    <div 
                      className={`
                        ${styles['state-circle']}
                        ${styles[`state-${(lowerCase(row[stateProp]))}`]}
                      `}
                      title={row[stateProp]}
                    />
                    <Text size="xs">{row[column]}</Text>
                  </Group>
                ) : (
                  <Text size="xs">{row[column]}</Text>
                )}
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}

export default RecordTable