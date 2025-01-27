import {
  CardColumns,
  Card,
  ListGroup
} from 'react-bootstrap'

function RestockUnits ({ product }) {
  const {
    fba,
    warehouse,
    needFbaRestock,
    needWarehouseRestock
  } = product.restockUnits

  return (
    <>
      <ListGroup.Item variant={needFbaRestock && "primary"}>
        <strong>FBA restock:</strong> {fba}
      </ListGroup.Item>

      <ListGroup.Item variant={needWarehouseRestock && "primary"}>
        <strong>Warehouse restock:</strong> {warehouse}
      </ListGroup.Item>
    </>
  )
}

function Sales ({ sales }) {
  return sales.map((period, i) => {
    const last = i === sales.length - 1
    return (
      <>{period}{last ? '' : ', '}</>
    )
  })
}

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
                <RestockUnits product={product} />
                <ListGroup.Item><strong>Projected monthly sales:</strong> {product.amzProjectedMonthlyUnitSales}</ListGroup.Item>
                <ListGroup.Item>
                  <strong>30 day sales → new: </strong>
                  <Sales sales={product.amzUnitSalesBy30DayPeriods} />
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
