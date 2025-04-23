import { useState } from 'react'
import { Button } from '@mantine/core'

import api from '@/utils/api'

function ShippingManifest({ shipments }) {
  const [ isCreatingManifest, setIsCreatingManifest ] = useState(false)

  async function createManifest (shipments) {
    const shipmentsMassaged = []

    for (let i = 0; i < shipments.length; i++) {
      const shipment = shipments[i]
      const [run, product, cartonTemplate] = await Promise.all(
        ['run', 'product', 'cartonTemplate'].map(async (prop) => {
          const id = shipment.properties[prop]?.id
          return await api.getResource(prop, id)
        })
      )
      if (!cartonTemplate) {
        alert("Shipment has no carton template. Carton templates are required to generate manifest weight and dimensions.")
        return
      }

      if (!run) {
        console.warn("Shipment has no production run. If this was intentional, disregard this message.")
      }

      const exp = run?.properties?.exp?.start
      // Massage to form MM/DD/YYYY
      const massagedExp = exp ? `${exp.slice(5, 7)}/${exp.slice(8, 10)}/${exp.slice(0, 4)}` : null

      shipmentsMassaged.push({
        totalUnits: shipment.properties.units.value,
        numCartons: shipment.properties.numCartons.value,
        sku: product.properties.sku.value,
        cartonWeight: cartonTemplate.properties.grossWeightLb.value,
        cartonLength: cartonTemplate.properties.lengthIn.value,
        cartonWidth: cartonTemplate.properties.widthIn.value,
        cartonHeight: cartonTemplate.properties.heightIn.value,
        cartonUnitQty: cartonTemplate.properties.unitQty.value,
        ...massagedExp ? { expiration: massagedExp } : {}
      })
    }

    api.createManifest(shipmentsMassaged)
  }

  return (
    <Button 
      disabled={shipments.length === 0}
      loading={isCreatingManifest}
      onClick={async () => {
        setIsCreatingManifest(true)
        try {
          await createManifest(shipments)
        } catch (error) {
          console.error('Error selecting shipments:', error)
        } finally {
          setIsCreatingManifest(false)
        }
      }}
    >
      Create Manifest
    </Button>
  )
}

export default ShippingManifest
