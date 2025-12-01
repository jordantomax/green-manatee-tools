import { useState } from 'react'
import { SimpleGrid } from '@mantine/core'

import { setLocalData, getLocalData } from '@/utils/storage'
import InventoryProductCard from './InventoryProductCard'

function InventoryRestockRecs ({ products, location }) {
  const storageKey = `inventoryRecsDone${location || 'None'}`
  const [doneSkus, setDoneSkus] = useState(getLocalData(storageKey) || [])

  function handleDone (product) {
    const isDone = doneSkus.includes(product.sku)
    const updated = isDone
      ? doneSkus.filter(sku => sku !== product.sku)
      : [...doneSkus, product.sku]
    setDoneSkus(updated)
    setLocalData(storageKey, updated)
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
      {products.map((product, i) => (
        <InventoryProductCard 
          key={i} 
          product={product} 
          location={location}
          isDone={doneSkus.includes(product.sku)}
          onDone={() => handleDone(product)}
        />
      ))}
    </SimpleGrid>
  )
}

export default InventoryRestockRecs
