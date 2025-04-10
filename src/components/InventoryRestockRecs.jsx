import { SimpleGrid } from '@mantine/core'

import InventoryProductCard from './InventoryProductCard'

function InventoryRestockRecs ({ products }) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
      {products.map((product, i) => (
        <InventoryProductCard key={i} product={product} />
      ))}
    </SimpleGrid>
  )
}

export default InventoryRestockRecs
