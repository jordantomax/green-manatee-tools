import { useState, useEffect } from 'react'
import { Title, Stack, Group } from '@mantine/core'

import api from '@/api'
import { useAsync } from '@/hooks/useAsync'
import NotFound from '@/views/NotFound'
import DataList from '@/components/DataList'

function ProductTarget({ asin, targetId, recordsByDate, recordsAggregate }) {
  const { run, isLoading, loadingStates } = useAsync()
  const [productTarget, setProductTarget] = useState(null)

  useEffect(() => {
    const adGroupId = recordsAggregate.adGroupId
    if (!adGroupId) return
    
    run(async () => {
      const productTarget = await api.getProductTarget(asin, adGroupId)
      setProductTarget(productTarget)
    }, 'productTarget')
  }, [recordsAggregate?.adGroupId])
  

  if (!targetId) {
    return <NotFound message="The search term has no target ID." />
  }
  
  return (
    <Stack>
      <Group align="center">
        <Title order={1}>{asin}</Title>
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

export default ProductTarget
