import { useState, useEffect, useRef, memo } from 'react'
import { Text, Table, Group, Box } from '@mantine/core'
import startCase from 'lodash-es/startCase'
import lowerCase from 'lodash-es/lowerCase'

import styles from '@/styles/RecordTable.module.css'
import StickyHeaderTable from '@/components/StickyHeaderTable'

const orderColumns = (columns, order) => {
  if (order && Array.isArray(order)) {
    const orderedColumns = order.filter(col => columns.includes(col))
    const remainingColumns = columns.filter(col => !order.includes(col))
    return [...orderedColumns, ...remainingColumns]
  }
  return columns
}

const RecordTable = memo(function RecordTable({ 
  data,
  columnOrder,
  handleRowClick,
  stateProp,
  hiddenColumns = [],
  negativeKeywordProp,
}) {
  const theadRef = useRef(null)
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
    <StickyHeaderTable theadRef={theadRef}>  
      <Table size="sm">
        <Table.Thead ref={theadRef}>
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
                  {colIdx === 0 ? (
                    <Group gap="xs" align="center" wrap="nowrap">
                      {stateProp && (
                        <Box
                          className={`
                            ${styles['state-circle']}
                            ${styles[`state-${(lowerCase(row[stateProp]))}`]}
                          `}
                          title={row[stateProp]}
                        />
                      )}
                      {negativeKeywordProp && row[negativeKeywordProp] === 'ENABLED' && (
                        <Box 
                          className={styles.negativeKeyword}
                          title="Negative Keyword"
                        >
                          N
                        </Box>
                      )}
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
    </StickyHeaderTable>
  )
})

export default RecordTable