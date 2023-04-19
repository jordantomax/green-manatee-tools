import React from 'react'
import {
  Form,
  Container,
  Card,
  Button
} from 'react-bootstrap'
import styled from 'styled-components'

import { AuthContext } from '../context/Auth'
import Input from '../components/InputStacked'

function Auth () {
  const auth = React.useContext(AuthContext)
  const [shippoToken, setShippoToken] = React.useState('')
  const [notionToken, setNotionToken] = React.useState('')

  function handleSubmit (e) {
    e.preventDefault()
    auth.logIn({ shippo: shippoToken, notion: notionToken })
  }

  return (
    <Bg className='bg-dark'>
      <Content>
        <h1 className='text-white'>Log in</h1>
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Input
                vertical
                label='Shippo API Token'
                onChange={e => setShippoToken(e.target.value)}
              />

              <Input
                vertical
                label='Notion API Token'
                onChange={e => setNotionToken(e.target.value)}
              />

              <Buttons>
                <Button type='submit'>
                  Log In
                </Button>
              </Buttons>
            </Form>
          </Card.Body>
        </Card>
      </Content>
    </Bg>
  )
}

const Bg = styled.div`
  height: 100%;
`

const Content = styled(Container)`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  max-width: 500px;
`

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

export default Auth
