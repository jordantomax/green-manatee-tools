import { call } from './core'

export async function getRecs () {
  return call(`recommendations`, {
    method: 'GET',
  })
}

export async function createOutShipment (recommendation, destinationName, cartonQty) {
  const shipment = {
    productId: recommendation.product.id,
    cartonTemplateId: recommendation.cartonTemplateId,
    destinationName,
    cartonQty
  }

  return call(`shipments/out`, {
    method: 'POST',
    body: shipment
  })
}