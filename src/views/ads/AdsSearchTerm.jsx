import { useEffect, useState, useCallback } from "react"

import api from "@/utils/api"
import { Stack, Title } from "@mantine/core"
import { useAsync } from '@/hooks/useAsync'

function AdsSearchTerm() {
  const [searchTerms, setSearchTerms] = useState([])
  const { run, isLoading } = useAsync()

  const handleRefreshSearchTerms = useCallback(async () => {
    const data = await run(async () => await api.getAdsSearchTerms())
    setSearchTerms(data)
  }, [run])

  useEffect(() => { 
    handleRefreshSearchTerms()  
  }, [handleRefreshSearchTerms])
  
  return (
    <Stack>
      <Title order={1}>Search Terms</Title>
    </Stack>
  )
}

export default AdsSearchTerm