import React from 'react'
import {
  Container,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Box,
  Group,
  Image,
  Anchor
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { AuthContext } from '@/contexts/Auth'
import { Link, useNavigate } from 'react-router-dom'
import useAsync from '@/hooks/useAsync'

function Signup () {
  const auth = React.useContext(AuthContext)
  const navigate = useNavigate()
  const { isLoading, run } = useAsync()
  
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      apiKey: ''
    },
    validate: {
      email: (value) => (!value ? 'Email is required' : null),
      password: (value) => (!value ? 'Password is required' : null),
      apiKey: (value) => (!value ? 'API Key is required' : null)
    }
  })

  async function handleSubmit(values) {
    await run(() => auth.signUp(values.email, values.password, values.apiKey))
    navigate('/')
  }

  return (
    <Box 
      h="100vh"
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
              Sign up
            </Title>
          </Group>
        
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="Enter your email"
                required
                disabled={isLoading}
                {...form.getInputProps('email')}
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                required
                disabled={isLoading}
                {...form.getInputProps('password')}
              />

              <PasswordInput
                label="API Key"
                placeholder="Enter your API key"
                required
                disabled={isLoading}
                {...form.getInputProps('apiKey')}
              />

              <Button type="submit" fullWidth mt="md" loading={isLoading}>
                Sign Up
              </Button>
            </Stack>
          </form>
        </Paper>

        <Group justify="center" mt="md">
          <Anchor component={Link} to="/" size="sm">Login</Anchor>
        </Group>
      </Container>
    </Box>
  )
}

export default Signup 