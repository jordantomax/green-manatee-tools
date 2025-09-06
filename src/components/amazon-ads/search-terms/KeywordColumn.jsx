import { Group, Box, Text } from "@mantine/core"
import lowerCase from 'lodash-es/lowerCase'
import styles from '@/styles/RecordTable.module.css'

function KeywordColumn({ row, state }) {
  return (
    <Group gap="xs" wrap="nowrap">
      <Box 
        className={`${styles['state-circle']} ${styles[`state-${(lowerCase(state))}`]}`}
        title={state}
      />

      <Text size="xs">{row.keyword}</Text>
    </Group>
  )
}

export default KeywordColumn
