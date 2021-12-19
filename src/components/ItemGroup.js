import React from 'react'
import { Button, Card } from 'react-bootstrap'
import capitalize from 'lodash/capitalize'

import Input from './Input'
import camelToSentenceCase from '../utils/camelToSentenceCase'

function ItemGroup ({
  name,
  items,
  factory,
  handleChange
}) {
  function handleItemCreate () {
    const update = items.slice()
    update.push(factory())
    handleChange(update)
  }

  function handleItemDelete (i) {
    const update = items.slice()
    update.splice(i, 1)
    handleChange(update)
  }

  function handleItemChange (i, e) {
    const update = items.slice()
    const { name, value } = e.target
    update[i][name] = value
    handleChange(update)
  }

  return (
    <>
      <h3 className='d-flex justify-content-between align-items-center'>
        {capitalize(name)}s

        <Button onClick={handleItemCreate}>
          Add Parcel
        </Button>
      </h3>

      {items.map((item, itemIndex) => {
        return (
          <Card className='mb-3' key={item.id}>
            <Card.Header>
              {capitalize(name)} {itemIndex}

              <Card.Link style={{ cursor: 'pointer', float: 'right' }} onClick={() => handleItemDelete(itemIndex)}>
                Delete
              </Card.Link>
            </Card.Header>

            <Card.Body>
              {Object.entries(item)
                .filter(([key]) => key !== 'id')
                .map(([key, value], i) => {
                  return (
                    <Input
                      key={`${item.id}-${key}`}
                      id={key}
                      label={camelToSentenceCase(key)}
                      defaultValue={value}
                      onChange={e => handleItemChange(itemIndex, e)}
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

export default ItemGroup
