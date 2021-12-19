import React from 'react'
import { Button, Card } from 'react-bootstrap'

import camelToSentenceCase from '../utils/camelToSentenceCase'
import { parcelFactory } from '../factories'
import Input from './Input'

function Parcels ({
  parcels,
  handleChange
}) {
  function handleParcelChange (value) {
    handleChange({
      target: { name: 'parcels', value }
    })
  }

  function handleCreate () {
    const update = parcels.slice()
    update.push(parcelFactory())
    handleParcelChange(update)
  }

  function handleDelete (i) {
    const update = parcels.slice()
    update.splice(i, 1)
    handleParcelChange(update)
  }

  function handleUpdate (i, name, value) {
    const update = parcels.slice()
    update[i][name] = value
    handleParcelChange(update)
  }

  return (
    <>
      <h3 className='d-flex justify-content-between align-items-center'>
        Parcels

        <Button onClick={handleCreate}>
          Add Parcel
        </Button>
      </h3>

      {parcels.map((parcel, parcelIndex) => {
        return (
          <Card className='mb-3' key={parcel.id}>
            <Card.Header>
              Parcel {parcelIndex}

              <Card.Link style={{ cursor: 'pointer', float: 'right' }} onClick={() => handleDelete(parcelIndex)}>
                Delete
              </Card.Link>
            </Card.Header>

            <Card.Body>
              {Object.entries(parcel).map(([key, value], i) => {
                if (key === 'id') return false

                return (
                  <Input
                    key={`${parcel.id}-${key}`}
                    id={key}
                    label={camelToSentenceCase(key)}
                    defaultValue={value}
                    onChange={(e) => {
                      const { name, value } = e.target
                      handleUpdate(parcelIndex, name, value)
                    }}
                  />
                )
              })}
            </Card.Body>
          </Card>
        )
      })}
    </>
  )
}

export default Parcels
