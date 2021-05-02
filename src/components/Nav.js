import React from 'react'
import { Navbar, Nav, Button, Spinner } from 'react-bootstrap'

import { AuthContext } from '../context/Auth'

function AppNav ({
  setRateData,
  handleSubmit,
  isLoading
}) {
  const auth = React.useContext(AuthContext)

  function handleLogOut () {
    auth.logOut()
  }

  return (
    <Navbar fixed='top' bg='dark' variant='dark'>
      <Nav className='mr-auto'>
        <Nav.Link onClick={handleLogOut}>
          Log Out
        </Nav.Link>
      </Nav>

      <Nav>
        <Nav.Item>
          <Nav.Link
            onClick={() => setRateData({ rates: [], parcels: [] })}
          >
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
            Get Rates
          </Button>
        </Nav.Item>
      </Nav>
    </Navbar>
  )
}

export default AppNav
