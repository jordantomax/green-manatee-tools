import { CardColumns } from 'react-bootstrap'

import InventoryProductCard from './InventoryProductCard'


function InventoryRestockRecs ({ products }) {
  return (
    <CardColumns className='mb-4'>
      {products.map((product, i) => (<InventoryProductCard key={i} product={product} />))}
    </CardColumns>
  )
}

export default InventoryRestockRecs
