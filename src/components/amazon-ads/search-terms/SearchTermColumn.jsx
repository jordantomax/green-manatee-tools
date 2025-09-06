import { Group, Box, Text } from "@mantine/core"
import toUpper from 'lodash-es/toUpper'
import { TARGET_STATES } from '@/utils/constants'
import { findActiveNegativeKeyword } from '@/utils/amazon-ads'
import styles from '@/styles/RecordTable.module.css'

function SearchTermColumn({ row, negativeKeywords, negativeTargets }) {
  const negativeKeyword = findActiveNegativeKeyword(
    negativeKeywords, 
    row.searchTerm, 
    row.campaignId
  )

  const negativeTarget = negativeTargets?.find(t => {
    return (
      toUpper(t.expression?.[0]?.value) === toUpper(row.searchTerm) && 
      t.adGroupId === row.adGroupId
    )
  })

  return (
    <Group gap="0" wrap="nowrap">
      {negativeKeyword?.state === TARGET_STATES.ENABLED && (
        <Box className={`${styles.negative} ${styles.visible}`} title="Negative Keyword">
          N
        </Box>
      )}

      {negativeTarget?.state === TARGET_STATES.ENABLED && (
        <Box className={`${styles.negative} ${styles.visible}`} title="Negative Target">
          N
        </Box>
      )}

      <Text size="xs">{row.searchTerm}</Text>
    </Group>
  )
}

export default SearchTermColumn
