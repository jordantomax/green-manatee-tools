import { Group, Box, Text } from "@mantine/core"
import { TARGET_STATES } from '@/utils/constants'
import { findActiveNegativeKeyword, findActiveNegativeTarget } from '@/utils/amazon-ads'
import styles from '@/styles/RecordTable.module.css'

function SearchTermColumn({ row, negativeKeywords, negativeTargets }) {
  const negativeKeyword = findActiveNegativeKeyword(
    negativeKeywords, 
    row.searchTerm, 
    row.campaignId
  )

  const negativeTarget = findActiveNegativeTarget(
    negativeTargets, 
    row.searchTerm, 
    row.campaignId
  )

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
