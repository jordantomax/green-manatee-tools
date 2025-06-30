import React from 'react'
import { Paper, Stack, Tabs } from '@mantine/core'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'

function Ads() {
  const navigate = useNavigate()
  const location = useLocation()
  const activeTab = location.pathname.split('/').pop() || 'reports'

  return (
    <Stack>
      <Tabs value={activeTab} onChange={(value) => navigate(`/ads/${value}`)}>
        <Tabs.List>
          <Tabs.Tab value="reports">Reports</Tabs.Tab>
          <Tabs.Tab value="search-terms">Search Terms</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Paper withBorder p="lg">
        <Outlet />
      </Paper>
    </Stack>
  )
}

export default Ads 