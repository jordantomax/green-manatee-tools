import React from 'react'
import {
  Container,
  Paper,
  Title,
  TextInput,
  Button,
  Stack,
  Box,
  rem,
  Image,
  Group
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { AuthContext } from '../context/Auth'

function Auth () {
  const auth = React.useContext(AuthContext)
  
  const form = useForm({
    initialValues: {
      notionToken: '',
      apiGatewayKey: ''
    },
    validate: {
      notionToken: (value) => (!value ? 'Notion token is required' : null),
      apiGatewayKey: (value) => (!value ? 'API Gateway key is required' : null)
    }
  })

  function handleSubmit(values) {
    auth.logIn(values)
  }

  return (
    <Box 
      h="100vh"
      minHeight="100vh"
      justify="center"
      py="xl"
      px="md"
      bg="gray.0"
    >
      <Container size="xxs">
        <Paper radius="md" p="xl" withBorder shadow="xs">
          <Group gap="md" align="center" mb="xl">
            <Title order={1}>
              Log in
            </Title>
          </Group>
        
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Notion API Token"
                placeholder="Notion API token"
                required
                {...form.getInputProps('notionToken')}
              />

              <TextInput
                label="API Gateway Key"
                placeholder="API Gateway key"
                required
                {...form.getInputProps('apiGatewayKey')}
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
