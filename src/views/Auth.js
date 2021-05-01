import React from 'react'
import {
  Form,
  Container,
  Button
} from 'react-bootstrap'
import styled from 'styled-components'

import { AuthContext } from '../context/Auth'
import Input from '../components/Input'

function Auth () {
  const auth = React.useContext(AuthContext)
  const [token, setToken] = React.useState('')

  function handleSubmit (e) {
    e.preventDefault()
    auth.logIn(token)
  }

  return (
    <Wrap>
      <h1>Log in</h1>
      <Form onSubmit={handleSubmit}>
        <Input
          label='Auth Token'
          onChange={e => setToken(e.target.value)}
        />

        <Button type='submit'>
          Log In
        </Button>
      </Form>
    </Wrap>
  )
}

const Wrap = styled(Container)`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  max-width: 400px;
`

export default Auth
