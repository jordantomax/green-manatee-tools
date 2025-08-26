import { useState, useEffect } from 'react'
import { Title, Stack, Group } from '@mantine/core'

import api from '@/api'
import { useAsync } from '@/hooks/useAsync'
import NotFound from '@/views/NotFound'
import DataList from '@/components/DataList'
import StateSelect from '@/components/amazon_ads/StateSelect'

function Target({ asin, targetId, recordsAggregate }) {
  const { run, isLoading, loadingStates } = useAsync()
  const [target, setTarget] = useState(null)

  useEffect(() => {
    const adGroupId = recordsAggregate.adGroupId
    if (!adGroupId) return
    
    run(async () => {
      const target = await api.getTarget(targetId, adGroupId)
      setTarget(target)
    }, 'target')
  }, [recordsAggregate?.adGroupId])

  const handleStateChange = (newState) => {
    run(async () => {
      await api.updateTarget(targetId, { state: newState })
      setTarget(prev => ({ ...prev, state: newState }))
    }, 'updateTarget')
  }

  if (!targetId) {
    return <NotFound message="The search term has no target ID." />
  }
  
  return (
    <Stack>
      <Group align="center">
        <Title order={1}>{asin}</Title>
      </Group>

      <StateSelect 
        value={target?.state}
        onChange={handleStateChange}
        isLoading={loadingStates.target || loadingStates.updateTarget}
      />

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
