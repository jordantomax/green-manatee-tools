import React from 'react'
import { Alert } from 'react-bootstrap'

function Messages ({ messages }) {
  if (!messages || messages.length === 0) return null

  return (
    <div className='mb-4'>
      <h3>Messages</h3>
      {messages.map((message, i) => {
        return (
          <Alert key={i} variant='danger'>
            Source: {message.source} <br />
            Code: {message.code} <br />
            Message: {message.text}
          </Alert>
        )
      })}
    </div>
  )
}

export default Messages
