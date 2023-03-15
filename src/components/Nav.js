import React from 'react'
import styled from 'styled-components'
import { Navbar, Nav, Button } from 'react-bootstrap'
import { Link } from "react-router-dom";

import { AuthContext, AuthConsumer } from '../context/Auth'
import ButtonSpinner from './ButtonSpinner'

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
    <Navbar bg='dark' variant='dark'>
      <Navbar.Brand><Link to='/' style={{color: 'white'}}>← Green Manatee Tools</Link></Navbar.Brand>
      <Nav>
        <Nav.Item>
          <Nav.Link target='_blank' href='https://thegreenmanatee.com'>
            <Logo>
              <LogoMark src='/logo.png' />
              A Green Manatee Project
            </Logo>
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Nav className='ml-auto'>
        <AuthConsumer>
          {({ isLoggedIn, tokens }) => {
            return isLoggedIn && (
              <>
                <Nav.Item>
                  <Token>
                    Logged in as {tokens.shippo}
                  </Token>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link onClick={handleLogOut}>
                    Log Out
                  </Nav.Link>
                </Nav.Item>
              </>
            )
          }}
        </AuthConsumer>

        {setRateData && (
          <>
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
                {isLoading && <ButtonSpinner />}
                Check Rates
              </Button>
            </Nav.Item>
          </>
        )}
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

const Logo = styled.div`
  display: flex;
  align-items: center;
  padding-left: 35px;
  position: relative;
`

const LogoMark = styled.img`
  max-height: 30px;
  position: absolute;
  left: 0;
`

export default AppNav
