import { useState, useEffect, useRef } from 'react'
import { SimpleGrid, Title, Paper } from '@mantine/core'

import { setLocalData, getLocalData, removeLocalData } from '@/utils/storage'
import InventoryRestockRec from './InventoryRestockRec'

function InventoryRestockRecs ({ recommendations, location }) {
  const storageKey = `inventoryRecsDone${location || 'None'}`
  const [doneSkus, setDoneSkus] = useState(getLocalData(storageKey) || [])
  const prevDatetimeRef = useRef(getLocalData('inventoryRecsDatetime'))

  useEffect(() => {
    const currentDatetime = getLocalData('inventoryRecsDatetime')
    const prevDatetime = prevDatetimeRef.current
    
    if (prevDatetime && currentDatetime !== prevDatetime) {
      setDoneSkus([])
      removeLocalData(storageKey)
    }
    
    prevDatetimeRef.current = currentDatetime
  }, [recommendations, storageKey])

  function handleDone (sku) {
    const isDone = doneSkus.includes(sku)
    const newDoneSkus = isDone
      ? doneSkus.filter(s => s !== sku)
      : [...doneSkus, sku]
    setDoneSkus(newDoneSkus)
    setLocalData(storageKey, newDoneSkus)
  }

  const locationLabel = (
    {
      fba: 'FBA',
      awd: 'AWD',
      warehouse: 'Warehouse'
    }[location]
  ) || 'Unknown'

  return (
    <>
      <Title order={3}>{locationLabel} — restock {recommendations?.length || 0} SKUs</Title>

      <Paper bg="gray.0">
        <SimpleGrid 
          cols={{ base: 1, sm: 2, md: 3 }} 
          spacing="md"
          styles={{ root: { alignItems: 'start' } }}
        >
          {recommendations.map((recommendation, i) => (
            <InventoryRestockRec 
              key={i} 
              recommendation={recommendation} 
              location={location}
              locationLabel={locationLabel}
              isDone={doneSkus.includes(recommendation.product.sku)}
              onDone={() => handleDone(recommendation.product.sku)}
            />
          ))}
        </SimpleGrid>
      </Paper>
    </>
  )
}

export default InventoryRestockRecs
