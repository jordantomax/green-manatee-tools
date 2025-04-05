import React from 'react'
import {
  Container,
  Paper,
  Title,
  TextInput,
  Button,
  Stack,
  Box,
  rem
} from '@mantine/core'
import { AuthContext } from '../context/Auth'

function Auth () {
  const auth = React.useContext(AuthContext)
  const [shippoToken, setShippoToken] = React.useState('')
  const [notionToken, setNotionToken] = React.useState('')
  const [apiGatewayKey, setApiGatewayKey] = React.useState('')

  function handleSubmit (e) {
    e.preventDefault()
    auth.logIn({
      shippo: shippoToken,
      notion: notionToken,
      apiGateway: apiGatewayKey
    })
  }

  return (
    <Box 
      minHeight="100vh"
      justify="center"
      py="xl"
      px="md"
    >
      <Container size="xxs">
        <Paper radius="md" p="xl" withBorder shadow="xs">
          <Title order={1} mb="xl">
            Log in
          </Title>
        
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Shippo API Token"
                placeholder="Shippo API token"
                value={shippoToken}
                onChange={(e) => setShippoToken(e.target.value)}
                required
              />

              <TextInput
                label="Notion API Token"
                placeholder="Notion API token"
                value={notionToken}
                onChange={(e) => setNotionToken(e.target.value)}
                required
              />

              <TextInput
                label="API Gateway Key"
                placeholder="API Gateway key"
                value={apiGatewayKey}
                onChange={(e) => setApiGatewayKey(e.target.value)}
                required
              />

              <Button type="submit" fullWidth mt="md">
                Log In
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}

export default Auth
