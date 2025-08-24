import api from '@/api'
import { useAsync } from '@/hooks/useAsync'
import { Button } from '@mantine/core'

const NegativeKeywordToggle = ({ 
  negativeKeyword,
  setNegativeKeywords,
  campaignId,
  adGroupId,
  keywordText,
  matchType='NEGATIVE_EXACT' 
}) => {
  const { run, isLoading } = useAsync()
  
  const createNegativeKeyword = () => {
    const data = {
      campaignId,
      adGroupId,
      keywordText,
      matchType
    }
    
    run(async () => {
      const { negativeKeywordId } = await api.createNegativeKeyword(data)
      setNegativeKeywords(prevKeywords => [...prevKeywords, { 
        ...data, 
        keywordId: negativeKeywordId,
        keywordText
      }])
    })
  }
  
  const deleteNegativeKeyword = () => {
    run(async () => {
      await api.deleteNegativeKeyword(negativeKeyword.keywordId)
      setNegativeKeywords(prevKeywords => prevKeywords.filter(k => k.keywordId !== negativeKeyword.keywordId))
    })
  }

  return (
          <Button 
            loading={isLoading} 
            variant="light"
            onClick={negativeKeyword ? deleteNegativeKeyword : createNegativeKeyword}
          >
            {negativeKeyword ? 'Remove Negative Keyword' : 'Add Negative Keyword'}
          </Button>
  )
}

export default NegativeKeywordToggle