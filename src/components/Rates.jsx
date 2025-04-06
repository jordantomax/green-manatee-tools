import React from 'react'
import { Form, Card, Button } from 'react-bootstrap'
import { useForm } from '@mantine/form'

import { rateMask, rateImageMask } from '../utils/dataMasks'
import DataList from './DataList'
import ButtonSpinner from './ButtonSpinner'
import api from '../utils/api'

function Rates ({ rates, setPurchasedRate }) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedRate, setSelectedRate] = React.useState(null)

  const form = useForm({
    initialValues: {
      rate: null,
      labelFileType: 'PDF_4x6'
    }
  })

  async function handleSubmit(values) {
    setIsLoading(true)
    try {
      const response = await api.shippoPurchaseLabel(values)
      setPurchasedRate(response)
    } catch (error) {
      console.error('Error purchasing rate:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleSelect(rateId) {
    setSelectedRate(rateId)
    form.setFieldValue('rate', rateId)
  }

  return (
    <Form className='mb-4' onSubmit={form.onSubmit(handleSubmit)}>
      <h3>Rates</h3>

      {rates.length === 0 && (
        <Card>
          <Card.Body>
            No rates
          </Card.Body>
        </Card>
      )}

      {rates
        .sort((a, b) => {
          const fa = parseFloat(a.amount)
          const fb = parseFloat(b.amount)
          if (fa === fb) return 0
          return fa > fb ? 1 : -1
        })
        .map((rate, i) => {
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

                  {selectedRate === rate.objectId && (
                    <Button
                      disabled={isLoading}
                      type='submit'
                    >
                      {isLoading && <ButtonSpinner />}
                      Purchase This Rate
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          )
        })
      }
    </Form>
  )
}

export default Rates
