import React from 'react'
import { AppShell, Group, Text, Stack, Image, Avatar, Menu, NavLink } from '@mantine/core'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '@/contexts/Auth'
import { IconChevronDown, IconUserFilled } from '@tabler/icons-react'

function AppNav() {
  const location = useLocation()
  const auth = React.useContext(AuthContext)

  function handleLogOut() {
    auth.logOut()
  }

  const navItems = [
    { label: 'Postage', to: '/postage' },
    { label: 'Shipping', to: '/shipping' },
    { label: 'Inventory', to: '/inventory' },
    { label: 'Ads', to: '/ads' }
  ]

  return (
    <AppShell.Navbar p="md">
      <Stack h="100%">
        <Group>
          <Image src="/logo512.png" h={30} w="auto" />
          <Text size="md" fw={700}>Green Manatee</Text>
        </Group>

        <Stack gap="xs" style={{ flex: 1 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              component={Link}
              to={item.to}
              label={item.label}
              active={location.pathname === item.to || location.pathname.startsWith(item.to + '/')}
            />
          ))}
        </Stack>

        <Stack gap="xs">
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <NavLink
                label={auth.user?.email || 'User'}
                leftSection={<Avatar radius="xl" size="sm"><IconUserFilled size={20} /></Avatar>}
                rightSection={<IconChevronDown size={16} />}
              />
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
