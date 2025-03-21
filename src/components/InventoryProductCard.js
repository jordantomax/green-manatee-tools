import { useState } from 'react'
import {
  Card,
  ListGroup,
  Button
} from 'react-bootstrap'

import api from '../utils/api'
import ButtonSpinner from '../components/ButtonSpinner'


function RestockUnits ({ product }) {
  const {
    fba,
    warehouse,
    needFbaRestock,
    needWarehouseRestock
  } = product.restock
  
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
      <span key={i}>{period}{last ? '' : ', '}</span>
    )
  })
}

function InventoryProductCard ({ product }) {
  const [isLoading, setIsLoading] = useState(false)
  async function createFbaShipment () {
    setIsLoading(true)
    await api.createFbaShipments([product])
    setIsLoading(false)
  }

  return (
    <Card key={product.sku}>
      <Card.Header>
        <h5>{product.name}</h5>
        <div className="pb-2">{product.sku}</div>
        <Button
          disabled={isLoading || !product.restock.needFbaRestock}
          variant="outline-info"
          size="sm"
          onClick={createFbaShipment}
        >
          {isLoading && <ButtonSpinner />}
          Create FBA Shipment
        </Button>
      </Card.Header>

      <ListGroup variant="flush" className="small">
        <RestockUnits product={product} />
        <ListGroup.Item><strong>Projected monthly sales:</strong> {product.sales.amzProjectedMonthlyUnitSales}</ListGroup.Item>
        <ListGroup.Item>
          <strong>30 day sales → new: </strong>
          <Sales sales={product.sales.amzUnitSalesBy30DayPeriods} />
        </ListGroup.Item>
        <ListGroup.Item><strong>Monthly growth rate:</strong> {product.sales.amzWeightedMonthlyGrowthRate}</ListGroup.Item>
        <ListGroup.Item><strong>FBA stock:</strong> {product.fba.stock}</ListGroup.Item>
        <ListGroup.Item><strong>FBA inbound:</strong> {product.fba.inbound}</ListGroup.Item>
        <ListGroup.Item><strong>AWD stock:</strong> {product.awd.stock}</ListGroup.Item>
        <ListGroup.Item><strong>AWD inbound:</strong> {product.awd.inbound}</ListGroup.Item>
        <ListGroup.Item><strong>Warehouse stock:</strong> {product.warehouse.stock}</ListGroup.Item>
      </ListGroup>
    </Card>
  )
}

export default InventoryProductCard
