import { call } from './core'

export async function getRecs () {
  return call(`recommendations`, {
    method: 'GET',
  })
}

export async function createFbaShipment (recommendation) {
  const shipment = {
    productId: recommendation.product.id,
    cartonTemplateId: recommendation.cartonTemplateId,
    cartonQty: Math.ceil(recommendation.restock.fba.restockQty/recommendation.cartonUnitQty) + 1
  }

  return call(`shipments/fba`, {
    method: 'POST',
    body: shipment
  })
}