import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEntityType } from '@/utils/amazon-ads'

function useSearchTermsNavigation() {
  const navigate = useNavigate()
  
  const handleRowClick = useCallback((row) => {
    const entityType = getEntityType(row.matchType)
    const entityId = row.keywordId
    const paramMap = { target: 'targetId', keyword: 'keywordId' }
    const param = paramMap[entityType]
    navigate(`/ads/search-terms/${encodeURIComponent(row.searchTerm)}?${param}=${entityId}`)
  }, [navigate])
  
  return { handleRowClick }
}

export default useSearchTermsNavigation
