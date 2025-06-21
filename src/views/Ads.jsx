import { Container } from '@mantine/core'
import { Outlet } from 'react-router-dom'

function Ads() {
  return (
    <Container size="md" py="xl">
      <Outlet />
    </Container>
  )
}

export default Ads 