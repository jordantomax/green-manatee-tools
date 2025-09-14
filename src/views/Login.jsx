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
import { Link } from 'react-router-dom'
import useAsync from '@/hooks/useAsync'

function Login () {
  const auth = React.useContext(AuthContext)
  const { isLoading, run } = useAsync()
  
  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validate: {
      email: (value) => (!value ? 'Email is required' : null),
      password: (value) => (!value ? 'Password is required' : null)
    }
  })

  async function handleSubmit(values) {
    await run(() => auth.logIn(values.email, values.password))
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
              Log in
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

              <Button type="submit" fullWidth mt="md" loading={isLoading}>
                Log In
              </Button>
            </Stack>
          </form>
        </Paper>

        <Group justify="center" mt="md">
          <Anchor component={Link} to="/signup" size="sm">Sign up</Anchor>
        </Group>
      </Container>
    </Box>
  )
}

export default Login
