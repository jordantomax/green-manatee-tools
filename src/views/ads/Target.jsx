import { useState, useEffect } from 'react'
import { Title, Stack, Group, Badge } from '@mantine/core'

import api from '@/api'
import useAsync from '@/hooks/useAsync'
import NotFound from '@/views/NotFound'
import DataList from '@/components/DataList'
import StateSelect from '@/components/amazon-ads/StateSelect'
import NegativeTargetButton from '@/components/NegativeTargetButton'
import { findActiveNegativeTarget } from '@/utils/amazon-ads'
import { TARGET_STATES } from '@/utils/constants'

function Target({ asin, targetId, recordsAggregate }) {
  const { run, isLoading, loadingStates } = useAsync()
  const [target, setTarget] = useState(null)
  const [negativeTargets, setNegativeTargets] = useState([])
  const activeNegativeTarget = findActiveNegativeTarget(negativeTargets, asin, recordsAggregate.campaignId)

  const handleStateChange = (newState) => {
    run(async () => {
      if (newState === TARGET_STATES.ARCHIVED) {
        await api.archiveTargets([targetId])
      } else {
        await api.updateTarget(targetId, { state: newState })
      }
      setTarget(prev => ({ ...prev, state: newState }))
    }, 'updateTarget')
  }
  
  const refreshNegativeTargets = () => {
    run(async () => {
      const negativeTargets = await api.listNegativeTargets({ filters: { adGroupIds: [recordsAggregate.adGroupId] } })
      setNegativeTargets(negativeTargets)
    }, 'negativeTargets')
  }

  useEffect(() => {
    const adGroupId = recordsAggregate.adGroupId
    if (!adGroupId) return
    
    run(async () => {
      const target = await api.getTarget(targetId, adGroupId)
      setTarget(target)
    }, 'target')
    
    refreshNegativeTargets()
  }, [recordsAggregate?.adGroupId])

  if (!targetId) {
    return <NotFound message="The search term has no target ID." />
  }
  
  return (
    <Stack>
      <Group align="center">
        <Title order={1}>{asin}</Title>

        {activeNegativeTarget && (
          <Badge variant="outline" color="red">
            {activeNegativeTarget.expression[0].type}
          </Badge>
        )}
      </Group>

      <Group>
        <StateSelect 
          value={target?.state}
          onChange={handleStateChange}
          isLoading={loadingStates.target || loadingStates.updateTarget}
        />

        <NegativeTargetButton 
          disabled={loadingStates.negativeTargets}
          negativeTarget={activeNegativeTarget}
          onSuccess={refreshNegativeTargets}
          campaignId={recordsAggregate.campaignId}
          adGroupId={recordsAggregate.adGroupId}
          asin={asin}
        />
      </Group>

      <DataList 
        data={recordsAggregate}
        keys={[
          { key: 'campaignName', label: 'Campaign', url: `/ads/campaigns/${recordsAggregate.campaignId}` },
          { key: 'adGroupName', label: 'Ad Group', url: `/ads/ad-groups/${recordsAggregate.adGroupId}` },
          { key: 'matchType', label: 'Match', badge: true },
        ]} 
      />
    </Stack>
  )
}

export default Target
