import React from 'react'
import styled from 'styled-components'
import { Navbar, Nav, Button, Spinner } from 'react-bootstrap'

import { AuthContext, AuthConsumer } from '../context/Auth'

function AppNav ({
  setRateData,
  setPurchasedRate,
  handleSubmit,
  isLoading
}) {
  const auth = React.useContext(AuthContext)

  function handleLogOut () {
    auth.logOut()
  }

  function handleResetRates () {
    setRateData({ rates: [], parcels: [] })
    setPurchasedRate(null)
  }

  return (
    <Navbar fixed='top' bg='dark' variant='dark'>
      <Nav className='ml-auto'>
        <Nav.Item>
          <AuthConsumer>
            {({ token }) => {
              return (
                <Token>
                  Logged in as {token}
                </Token>
              )
            }}
          </AuthConsumer>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link onClick={handleLogOut}>
            Log Out
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link onClick={handleResetRates}>
            Reset Rates
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Button
            className='ml-2'
            variant='primary'
            disabled={isLoading}
            onClick={handleSubmit}
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
            Check Rates
          </Button>
        </Nav.Item>
      </Nav>
    </Navbar>
  )
}

const Token = styled(Nav.Link)`
  max-width: 275px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export default AppNav
