import { useState } from 'react'
import { Button } from '@mantine/core'

import api from '../utils/api'

function BuildManifest ({ shipments }) {
  const [ isCreatingManifest, setIsCreatingManifest ] = useState(false)

  async function createManifest (shipments) {
    const shipmentsMassaged = []

    for (let i = 0; i < shipments.length; i++) {
      const shipment = shipments[i]
      const [run, product, cartonTemplate] = await Promise.all(
        ['run', 'product', 'cartonTemplate'].map(async (prop) => {
          const id = shipment.properties[prop]?.relation[0]?.id
          if (!id) return null
          return await api.notionGetPage(id)
        })
      )

      if (!cartonTemplate) {
        alert("Shipment has no carton template. Carton templates are required to generate manifest weight and dimensions.")
        return
      }

      if (!run) {
        console.warn("Shipment has no production run. If this was intentional, disregard this message.")
      }

      const exp = run?.properties?.exp?.date?.start
      // Massage to form MM/DD/YYYY
      const massagedExp = exp ? `${exp.slice(5, 7)}/${exp.slice(8, 10)}/${exp.slice(0, 4)}` : null

      shipmentsMassaged.push({
        totalUnits: shipment.properties.units.formula.number,
        numCartons: shipment.properties.numCartons.number,
        sku: product.properties.sku.title[0].plainText,
        cartonWeight: cartonTemplate.properties.grossWeightLb.formula.number,
        cartonLength: cartonTemplate.properties.lengthIn.formula.number,
        cartonWidth: cartonTemplate.properties.widthIn.formula.number,
        cartonHeight: cartonTemplate.properties.heightIn.formula.number,
        cartonUnitQty: cartonTemplate.properties.unitQty.number,
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

export default BuildManifest
