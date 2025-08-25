import { useState, useEffect } from 'react'
import { Title, Stack, Group } from '@mantine/core'

import api from '@/api'
import { useAsync } from '@/hooks/useAsync'
import NotFound from '@/views/NotFound'
import DataList from '@/components/DataList'
import StateSelect from '@/components/amazon_ads/StateSelect'

function ProductTarget({ asin, targetId, recordsAggregate }) {
  const { run, isLoading, loadingStates } = useAsync()
  const [productTarget, setProductTarget] = useState(null)

  useEffect(() => {
    const adGroupId = recordsAggregate.adGroupId
    if (!adGroupId) return
    
    run(async () => {
      const productTarget = await api.getProductTarget(targetId, adGroupId)
      setProductTarget(productTarget)
    }, 'productTarget')
  }, [recordsAggregate?.adGroupId])

  const handleStateChange = (newState) => {
    run(async () => {
      await api.updateProductTarget(targetId, { state: newState })
      setProductTarget(prev => ({ ...prev, state: newState }))
    }, 'updateProductTarget')
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
        value={productTarget?.state}
        onChange={handleStateChange}
        isLoading={loadingStates.productTarget || loadingStates.updateProductTarget}
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

export default ProductTarget
