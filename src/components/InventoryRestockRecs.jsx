import { useState, useEffect, useRef } from 'react'
import { SimpleGrid, Title } from '@mantine/core'

import { setLocalData, getLocalData, removeLocalData } from '@/utils/storage'
import InventoryProductCard from './InventoryProductCard'

function InventoryRestockRecs ({ products, location, onCreateShipment }) {
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
  }, [products, storageKey])

  function handleDone (product) {
    const isDone = doneSkus.includes(product.sku)
    const updated = isDone
      ? doneSkus.filter(sku => sku !== product.sku)
      : [...doneSkus, product.sku]
    setDoneSkus(updated)
    setLocalData(storageKey, updated)
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
      <Title order={3}>{locationLabel} — restock {products?.length || 0} SKUs</Title>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {products.map((product, i) => (
          <InventoryProductCard 
            key={i} 
            product={product} 
            location={location}
            locationLabel={locationLabel}
            isDone={doneSkus.includes(product.sku)}
            onDone={() => handleDone(product)}
            onCreateShipment={onCreateShipment}
          />
        ))}
      </SimpleGrid>
    </>
  )
}

export default InventoryRestockRecs
