import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'

import { AuthContext } from '../context/Auth'

function AppNav () {
  const auth = React.useContext(AuthContext)

  function handleLogOut () {
    auth.logOut()
  }

  return (
    <Navbar>
      <Nav>
        <Nav.Link onClick={handleLogOut}>
          Log Out
        </Nav.Link>
      </Nav>
    </Navbar>
  )
}

export default AppNav
