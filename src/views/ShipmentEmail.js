import React from 'react'

import NotionShipments from '../components/NotionShipments'

function ShipmentEmail () {
  function handleSelectShipment (shipments) {
    console.log(shipments)
  }

  return (
    <div>
      <NotionShipments handleSelectShipment={handleSelectShipment} />
    </div>
  )
}

export default ShipmentEmail
