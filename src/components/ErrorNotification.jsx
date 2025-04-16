import React, { useState, useEffect } from 'react'
import { Notification, Text, Stack } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { setErrorHandler } from '../utils/api'

function ErrorNotification() {
  const [error, setError] = useState(null)

  useEffect(() => {
    // Set this component as the global error handler
    setErrorHandler((err) => {
      console.error('API Error:', err)
      setError(err)
    })
    
    // Clean up when component unmounts
    return () => setErrorHandler(null)
  }, [])

  if (!error) return null

  return (
    <Notification
      color="red"
      title="Error"
      icon={<IconAlertCircle size={18} />}
      withCloseButton
      onClose={() => setError(null)}
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
        maxWidth: 400
      }}
    >
      <Stack gap="xs">
        <Text size="sm" fw={500}>
          {error.message || 'An unexpected error occurred'}
        </Text>
        {error.status && (
          <Text size="xs" c="dimmed">
            Status: {error.status}
          </Text>
        )}
        {error.data && (
          <Text size="xs" c="dimmed">
            {typeof error.data === 'object' 
              ? JSON.stringify(error.data) 
              : error.data}
          </Text>
        )}
      </Stack>
    </Notification>
  )
}

export default ErrorNotification 