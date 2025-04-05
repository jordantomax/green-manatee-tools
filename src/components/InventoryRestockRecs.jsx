import { Row, Col } from 'react-bootstrap'

import InventoryProductCard from './InventoryProductCard'


function InventoryRestockRecs ({ products }) {
  return (
    <Row className='mb-4'>
      {products.map((product, i) => (
        <Col key={i} xs={12} sm={6} md={4} lg={3} className="mb-4">
          <InventoryProductCard product={product} />
        </Col>
      ))}
    </Row>
  )
}

export default InventoryRestockRecs
