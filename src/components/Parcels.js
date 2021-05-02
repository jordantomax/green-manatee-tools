import React from 'react'
import { Button } from 'react-bootstrap'

import Input from './Input'

function Parcels ({
  parcels,
  handleDelete,
  handleUpdate
}) {
  return (
    <>
      <h3>Parcels</h3>

      {parcels.map((parcel, parcelIndex) => {
        return (
          <div className='mb-3' key={parcelIndex}>
            <h5 className='d-flex justify-content-between align-items-center'>
              Parcel {parcelIndex}
              <Button
                size='sm'
                variant='light'
                onClick={() => handleDelete(parcelIndex)}
              >
                Delete
              </Button>
            </h5>

            {Object.entries(parcel).map(([key, value], i) => {
              return (
                <Input
                  key={key}
                  id={key}
                  label={key}
                  defaultValue={value}
                  onChange={(e) => {
                    const { name, value } = e.target
                    handleUpdate(parcelIndex, name, value)
                  }}
                />
              )
            })}
          </div>
        )
      })}
    </>
  )
}

export default Parcels
