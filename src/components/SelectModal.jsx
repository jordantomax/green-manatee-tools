import React, { useState } from 'react'
import {
  Button,
  Modal,
  ListGroup,
  Form
} from 'react-bootstrap'
import { get } from 'lodash'

import ButtonSpinner from './ButtonSpinner'

function SelectModal({ 
    data,
    title,
    labelKey,
    show,
    isLoading,
    onSelect,
    onHide,
    onRefresh
}) {
  const [selectedItem, setSelectedItem] = useState(null)
  const [isLoadingSelect, setIsLoadingSelect] = useState(false)
  const [filterText, setFilterText] = useState('')

  async function handleSelect() {
    setIsLoadingSelect(true)
    await onSelect(selectedItem)
    setIsLoadingSelect(false)
    onHide()
  }

  const filteredData = data?.filter(item => {
    const label = labelKey ? get(item, labelKey) : item.id
    return label.toLowerCase().includes(filterText.toLowerCase())
  })

  return (
    <Modal centered show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title || 'Select Item'}</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: '350px', overflow: 'scroll' }}>
        <Form.Control
          type="text"
          placeholder="Filter items..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="mb-3"
        />

        <ListGroup>
          {filteredData && filteredData.map(item => (
            <ListGroup.Item
              key={item.id}
              action
              onClick={() => setSelectedItem(item)}
            >
              <Form.Check
                type='radio'
                readOnly
                checked={selectedItem?.id === item.id}
                label={labelKey ? get(item, labelKey) : item.id}
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={onRefresh} disabled={isLoading}>
          {isLoading && <ButtonSpinner />}
          Refresh
        </Button>
        <Button variant='primary' disabled={!selectedItem} onClick={handleSelect}>
          {isLoadingSelect && <ButtonSpinner />}
          Select
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SelectModal