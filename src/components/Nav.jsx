import React from 'react'
import { AppShell, Group, Button, Text, Stack, Image, Avatar, Menu } from '@mantine/core'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '@/contexts/Auth'
import { IconChevronDown, IconUserFilled } from '@tabler/icons-react'

function AppNav() {
  const location = useLocation()
  const auth = React.useContext(AuthContext)

  function handleLogOut() {
    auth.logOut()
  }

  return (
    <AppShell.Navbar p="md">
      <Stack h="100%">
        <Group>
          <Image src="/logo512.png" h={30} w="auto" />
          <Text size="md" fw={700}>Green Manatee</Text>
        </Group>

        <Stack gap="xs" style={{ flex: 1 }}>
          <Button
            component={Link}
            to="/postage"
            variant={location.pathname === '/postage' ? 'light' : 'subtle'}
            fullWidth
            justify="start"
          >
            Postage
          </Button>
          <Button
            component={Link}
            to="/shipping"
            variant={location.pathname === '/shipping' ? 'light' : 'subtle'}
            fullWidth
            justify="start"
          >
            Shipping
          </Button>
          <Button
            component={Link}
            to="/inventory"
            variant={location.pathname === '/inventory' ? 'light' : 'subtle'}
            fullWidth
            justify="start"
          >
            Inventory
          </Button>
        </Stack>

        <Stack gap="xs">
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Group gap={0}>
                <Avatar radius="xl" size="sm" color="gray">
                  <IconUserFilled size={20} />
                </Avatar>
                <div style={{ flex: 1, marginLeft: 8 }}>
                  <Text size="sm" fw={500}>User</Text>
                  <Text size="xs" c="dimmed" truncate="end" style={{ maxWidth: 150 }}>
                    {auth.tokens.shippo}
                  </Text>
                </div>
                <IconChevronDown size={16} />
              </Group>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item color="red" onClick={handleLogOut}>
                Log Out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Stack>
      </Stack>
    </AppShell.Navbar>
  )
}

export default AppNav
