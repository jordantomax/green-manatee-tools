import { Text, Table } from '@mantine/core'
import { useEffect, useState } from 'react'

import styles from '@/styles/RecordTable.module.css'

function RecordTable({ data }) {
  const [columns, setColumns] = useState([])

  useEffect(() => {
    setColumns(Object.keys(data[0] || {}))
  }, [data])

  if (data.length === 0) {
    return <Text>Loading...</Text>
  }
  
  return (
    <Table.ScrollContainer type="native">
      <Table highlightOnHover size="sm">
        <Table.Thead>
          <Table.Tr>
            {columns.map((column, colIdx) => (
              <Table.Th 
                className={styles.th}
                key={column}>
                {column}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {data.map((row, rowIdx) => (
            <Table.Tr className={styles.row} key={rowIdx}>
              {columns.map((column, colIdx) => (
                <Table.Td 
                  className={styles.td}
                  key={`${rowIdx}-${column}`}
                >
                  <Text size="xs">{row[column]}</Text>
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}

export default RecordTable