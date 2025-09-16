import { useState, useCallback } from 'react'
import api from '@/api'
import useAsync from '@/hooks/useAsync'
import { getEntityType } from '@/utils/amazon-ads'

const getEntities = async (data) => {
  const [keywordsData, targetsData] = await Promise.all([
    api.listKeywords({ filters: { keywordIds: data.map(d => d.keywordId) } }),
    api.listTargets({ filters: { targetIds: data.map(d => d.keywordId) } })
  ])
  
  return {
    keywords: keywordsData?.reduce(
      (map, keyword) => ({ ...map, [keyword.keywordId]: keyword }), {}
    ) || {},
    targets: targetsData?.reduce(
      (map, target) => ({ ...map, [target.targetId]: target }), {}
    ) || {}
  }
}

const getNegativeEntities = async (data) => {
  const keywordTexts = data.filter(d => getEntityType(d.matchType) === 'keyword').map(d => d.searchTerm)
  const asins = data.filter(d => getEntityType(d.matchType) === 'target').map(d => d.searchTerm)

  const [negativeKeywords, negativeTargets] = await Promise.all([
    api.listNegativeKeywords({ filters: { keywordTexts } }),
    api.listNegativeTargets({ filters: { asins } })
  ])

  return {
    keywords: negativeKeywords,
    targets: negativeTargets
  }
}

function useSearchTermsData() {
  const [searchTerms, setSearchTerms] = useState([])
  const [entities, setEntities] = useState({ keywords: {}, targets: {} })
  const [negativeEntities, setNegativeEntities] = useState({ keywords: [], targets: [] })
  const { run, isLoading } = useAsync()

  const getSearchTermsData = useCallback(async ({
    dateRange,
    filter,
    sort,
    limit,
    page
  }) => {
    const { startDate, endDate } = dateRange
    
    const { data, pagination } = await run(() => api.getAdsSearchTerms({
      filter,
      sort,
      startDate,
      endDate,
      limit,
      page,
    }))
    
    setSearchTerms(data)
    
    run(async () => {
      const entitiesData = await getEntities(data)
      setEntities(entitiesData)
    })
    
    run(async () => {
      const negativeEntitiesData = await getNegativeEntities(data)
      setNegativeEntities(negativeEntitiesData)
    })
    
    
    return { data, pagination }
  }, [])

  return {
    searchTerms,
    entities,
    negativeEntities,
    getSearchTermsData,
    isLoading
  }
}

export default useSearchTermsData
