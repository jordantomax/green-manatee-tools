import { Stack, Group, Text, Select, Table, Pagination } from '@mantine/core'
import { useEffect, useState } from 'react'

import styles from '@/styles/RecordTable.module.css'

function RecordTable({ data, currentPage, pageSize, handlePageChange, handlePageSizeChange }) {
  const [columns, setColumns] = useState([])

  useEffect(() => {
    setColumns(Object.keys(data[0] || {}))
  }, [data])

  if (data.length === 0) {
    return <Text>Loading...</Text>
  }
  
  return (
    <Stack gap="md">

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

      <Group justify="space-between" align="center" mt="md">
        <Pagination
          value={currentPage}
          onChange={handlePageChange}
          // total={totalPages}
          size="sm"
          withEdges
          // disabled={totalPages <= 1}
        />
        <Select
          value={String(pageSize)}
          onChange={handlePageSizeChange}
          data={['10', '25', '50', '100'].map(n => ({ value: n, label: `${n} / page` }))}
          size="xs"
          style={{ width: 150 }}
        />
      </Group>
    </Stack>
  )
}

export default RecordTable