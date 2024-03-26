import { CardColumns, Card } from 'react-bootstrap'

function InventoryRestockRecs ({ products }) {
  return (
    <CardColumns className='mb-4'>
      {products.map(product => {
        return (
          <Card key={product.sku}>
            <Card.Body>
              {product.sku}
            </Card.Body>
          </Card>
        )
      })}
    </CardColumns>
  )
}

export default InventoryRestockRecs
