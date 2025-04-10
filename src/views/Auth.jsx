import React from 'react'
import {
  Container,
  Paper,
  Title,
  PasswordInput,
  Button,
  Stack,
  Box,
  Group,
  Image
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { AuthContext } from '../contexts/Auth'

function Auth () {
  const auth = React.useContext(AuthContext)
  
  const form = useForm({
    initialValues: {
      apiKey: ''
    },
    validate: {
      apiKey: (value) => (!value ? 'API key is required' : null)
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
        <Group justify="center" mb="xl">
          <Image src="/logo512.png" alt="Green Manatee Logo" w={50} h={50} />
          <Title order={3}>Green Manatee</Title>
        </Group>
        <Paper radius="md" p="xl" withBorder shadow="xs">
          <Group gap="md" align="center" mb="xl">
            <Title order={1}>
              Log in
            </Title>
          </Group>
        
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <PasswordInput
                label="API Key"
                placeholder="API key"
                required
                {...form.getInputProps('apiKey')}
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
