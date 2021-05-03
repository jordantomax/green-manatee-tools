import React from 'react'
import { Form, Card, Button, Spinner } from 'react-bootstrap'

import useForm from '../hooks/useForm'
import { rateMask, rateImageMask } from '../utils/dataMasks'
import DataList from '../components/DataList'

function Rates ({ rates, setPurchasedRate }) {
  const {
    input,
    isLoading,
    handleChange,
    handleSubmit
  } = useForm({
    resource: 'transaction',
    action: 'create',
    defaultInput: {
      rate: null,
      labelFileType: 'PDF_4x6'
    },
    afterSubmit: setPurchasedRate
  })

  function handleSelect (value) {
    handleChange({ target: { name: 'rate', value } })
  }

  return (
    <Form className='mb-4' onSubmit={handleSubmit}>
      <h3>Rates</h3>

      {rates.length === 0 && (
        <Card>
          <Card.Body>
            No rates
          </Card.Body>
        </Card>
      )}

      {rates.map((rate, i) => {
        return (
          <Card
            key={rate.objectId}
            className='mb-4'
          >
            <Card.Body>
              <DataList
                obj={rate}
                mask={rateMask}
                imageMask={rateImageMask}
              />
              <div className='mt-2'>
                <Button
                  variant='secondary'
                  className='mr-2'
                  onClick={() => handleSelect(rate.objectId)}
                >
                  Select This Rate
                </Button>

                {input.rate === rate.objectId && (
                  <Button
                    disabled={isLoading}
                    type='submit'
                  >
                    {isLoading && (
                      <Spinner
                        as='span'
                        animation='border'
                        size='sm'
                        role='status'
                        aria-hidden='true'
                        className='mr-2'
                      />
                    )}
                    Purchase This Rate
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        )
      })}
    </Form>
  )
}

export default Rates
