import React from 'react'
import {
  Container,
  ListGroup
} from 'react-bootstrap'
import { Link } from 'react-router-dom'

import styled from 'styled-components'

function Home () {
  return (
    <Bg className='bg-dark'>
      <Content>
        <ListGroup>
          <ListGroup.Item>
            <Link to='buy-postage'>Buy Postage</Link>
          </ListGroup.Item>

          <ListGroup.Item>
            <Link to='build-manifest'>Build Amazon Manifest</Link>
          </ListGroup.Item>


          <ListGroup.Item>
            <Link to='outbound-email'>Generate Outbound Email</Link>
          </ListGroup.Item>

          <ListGroup.Item>
            <Link to='inbound-email'>Generate Inbound Email</Link>
          </ListGroup.Item>
        </ListGroup>
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

export default Home
