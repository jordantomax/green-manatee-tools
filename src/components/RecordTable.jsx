import { useMemo, useRef, memo } from 'react'
import { Text, Table, Menu, Button, UnstyledButton } from '@mantine/core'
import startCase from 'lodash-es/startCase'
import isFunction from 'lodash-es/isFunction'

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
  hiddenColumns = [],
  onColumnHide,
  columnComponents = {},
}) {
  const theadRef = useRef(null)
  
  const columns = useMemo(() => {
    let cols = Object.keys(data[0] || {})
    cols = cols.filter(col => !hiddenColumns.includes(col))
    return orderColumns(cols, columnOrder)
  }, [data, columnOrder, hiddenColumns])

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
                className={colIdx === 0 ? `${styles.th} ${styles.stickyCol}` : styles.th}
                key={column}>
                <Menu position="bottom-start" width={200}>
                  <Menu.Target>
                    <UnstyledButton 
                      className={styles.colHeadButton}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {startCase(column)}
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown className={styles.thMenu}>
                    <Menu.Item onClick={() => onColumnHide(column)}>
                      Hide
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {data.map((row, rowIdx) => (
            <Table.Tr className={styles.row} key={rowIdx} onClick={() => handleRowClick(row)}>
              {columns.map((column, colIdx) => {
                const columnComponent = columnComponents[column]
                return (
                  <Table.Td 
                    className={colIdx === 0 ? styles.stickyCol : styles.td}
                    key={`${rowIdx}-${column}`}
                  >
                    {isFunction(columnComponent) ? (
                      columnComponent(row, { column, rowIdx, colIdx })
                    ) : (
                      <Text size="xs">{row[column]}</Text>
                    )}
                  </Table.Td>
                )
              })}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </StickyHeaderTable>
  )
})

export default RecordTable