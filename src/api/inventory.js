import { call } from './core'

export async function getRecs () {
  return call(`recommendations`, {
    method: 'GET',
  })
}

export async function createFbaShipment (product) {
  if (!product.restock?.needFbaRestock || !product.warehouse?.notionProductId) {
    return null
  }

  const shipment = {
    notionProductId: product.warehouse.notionProductId,
    notionCartonTemplateId: product.warehouse.notionCartonTemplateId,
    cartonQty: Math.ceil(product.restock.fba/product.warehouse.cartonUnitQty) + 1
  }

  return call(`shipments/fba`, {
    method: 'POST',
    body: shipment
  })
}
