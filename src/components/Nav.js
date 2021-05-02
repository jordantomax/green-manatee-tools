import React from 'react'
import { Navbar, Nav, Button } from 'react-bootstrap'

import { AuthContext } from '../context/Auth'

function AppNav ({ handleSubmit }) {
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
          <Button onClick={handleSubmit}>
            Get Rates
          </Button>
        </Nav.Item>
      </Nav>
    </Navbar>
  )
}

export default AppNav
