import { useState } from 'react'
import { Button, Menu } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'

import api from '@/api'
import { useNotification } from '@/contexts/Notification'

function ShippingManifest({ shipments }) {
  const [ isCreatingManifest, setIsCreatingManifest ] = useState(false)
  const { showNotification } = useNotification()

  async function createManifest (shipments, manifestType) {
    setIsCreatingManifest(true)
    try {
      const shipmentsMassaged = []

      for (let i = 0; i < shipments.length; i++) {
        const shipment = shipments[i]
        const [run, product, cartonTemplate] = await Promise.all(
          ['run', 'product', 'cartonTemplate'].map(async (prop) => {
            const id = shipment.properties[prop]?.id
            if (!id) {
              throw new Error(`Shipment ${shipment.properties.id.value} is missing ${prop} ID`)
            }
            return await api.getResource(prop, id)
          })
        )
        if (!cartonTemplate) {
          showNotification('error', "Shipment has no carton template. Carton templates are required to generate manifest weight and dimensions.")
          return
        }

        if (!run) {
          showNotification('error', "Shipment has no production run. If this was intentional, disregard this message.")
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
          manufacturingLotCode: run?.properties?.id?.value,
          ...massagedExp ? { expiration: massagedExp } : {}
        })
      }

      await api.createManifest(shipmentsMassaged, manifestType)
    } catch (error) {
      showNotification('error', error.message || 'Failed to create manifest')
    } finally {
      setIsCreatingManifest(false)
    }
  }

  return (
    <Menu width="target">
      <Menu.Target>
        <Button 
          disabled={shipments.length === 0}
          loading={isCreatingManifest}
          rightSection={<IconChevronDown size={16} />}
        >
          Create Manifest
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={() => createManifest(shipments, 'fba')}>
          FBA
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item onClick={() => createManifest(shipments, 'awd')}>
          AWD
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export default ShippingManifest
