import React, { Fragment } from 'react'
import { Stack, Tabs, Breadcrumbs, Anchor, Text } from '@mantine/core'
import { useNavigate, useLocation, useParams, Outlet } from 'react-router-dom'
import { IconChevronRight } from '@tabler/icons-react'

function Ads() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()

  const segments = params["*"] ? params["*"].split('/') : []

  return (
    <Stack>
      {segments.length === 1 ? (
        <Tabs 
          value={segments[0]} 
          onChange={(value) => navigate(`/ads/${value}`)}
        >
          <Tabs.List>
            <Tabs.Tab value="reports">Reports</Tabs.Tab>
            <Tabs.Tab value="search-terms">Search Terms</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      ) : (
        <Breadcrumbs separator={<IconChevronRight size={16} />}>
          {segments.map((segment, index) => {
            const name = decodeURIComponent(segment)

            if (index !== segments.length - 1) {
              return (
                <Anchor onClick={() => navigate(`/ads/${segments.slice(0, index + 1).join('/')}`)}>
                  {name}
                </Anchor>
              )
            }
            return (
              <Text fw={500}>{name}</Text>
            )
          })}
        </Breadcrumbs>
      )}

      <Outlet />
    </Stack>
  )
}

export default Ads 