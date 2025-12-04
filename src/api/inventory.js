import { call } from './core'

export async function getRecs () {
  return call(`recommendations`, {
    method: 'GET',
  })
}

export async function createOutShipment (recommendation, destinationName) {
  const shipment = {
    productId: recommendation.product.id,
    cartonTemplateId: recommendation.cartonTemplateId,
    cartonQty: Math.ceil(recommendation.restock.fba.restockQty/recommendation.cartonUnitQty) + 1,
    destinationName: destinationName
  }

  return call(`shipments/out`, {
    method: 'POST',
    body: shipment
  })
}