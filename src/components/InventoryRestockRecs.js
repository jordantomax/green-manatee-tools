import {
  CardColumns,
  Card,
  ListGroup
} from 'react-bootstrap'

function InventoryRestockRecs ({ products }) {
  return (
    <CardColumns className='mb-4'>
      {products.map(product => {
        return (
          <Card key={product.sku}>
            <Card.Header>
              <h5>{product.name}</h5>
              {product.sku}
            </Card.Header>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item variant="primary"><strong>FBA restock:</strong> {product.restockUnits.fba}</ListGroup.Item>
                <ListGroup.Item variant="primary"><strong>Warehouse restock:</strong> {product.restockUnits.warehouse}</ListGroup.Item>
                <ListGroup.Item><strong>Projected monthly sales:</strong> {product.amzProjectedMonthlyUnitSales}</ListGroup.Item>
                <ListGroup.Item>
                  <strong>30 day sales → new: </strong>
                  {product.amzUnitSalesBy30DayPeriods.map((period, i) => {
                    const last = i === product.amzUnitSalesBy30DayPeriods.length - 1
                    return (
                      <>{period}{last ? '' : ', '}</>
                    )
                  })}
                </ListGroup.Item>
                <ListGroup.Item><strong>Monthly growth rate:</strong> {product.amzWeightedMonthlyGrowthRate}</ListGroup.Item>
                <ListGroup.Item><strong>FBA units:</strong> {product.fbaFulfillableUnits}</ListGroup.Item>
                <ListGroup.Item><strong>FBA inbound units:</strong> {product.fbaInboundUnits}</ListGroup.Item>
                <ListGroup.Item><strong>Warehouse units:</strong> {product.warehouseUnits}</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        )
      })}
    </CardColumns>
  )
}

export default InventoryRestockRecs
