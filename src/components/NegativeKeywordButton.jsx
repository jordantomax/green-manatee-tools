import isFunction from 'lodash-es/isFunction'

import api from '@/api'
import useAsync from '@/hooks/useAsync'
import { Button } from '@mantine/core'

const NegativeKeywordButton = ({ 
  negativeKeyword,
  onSuccess,
  campaignId,
  adGroupId,
  keywordText,
  matchType='NEGATIVE_EXACT',
  isLoading: externalLoading
}) => {
  const { run, isLoading } = useAsync()
  
  const createNegativeKeyword = () => {
    run(async () => {
      const { keywordId } = await api.createNegativeKeyword({
        campaignId,
        adGroupId,
        keywordText,
        matchType
      })
      
      isFunction(onSuccess) && onSuccess()
    })
  }
  
  const deleteNegativeKeyword = () => {
    run(async () => {
      await api.deleteNegativeKeyword(negativeKeyword.keywordId)
      isFunction(onSuccess) && onSuccess()
    })
  }

  return (
          <Button 
            disabled={isLoading || externalLoading}
            loading={isLoading || externalLoading} 
            variant="default"
            size="xs"
            onClick={negativeKeyword ? deleteNegativeKeyword : createNegativeKeyword}
          >
            {negativeKeyword ? 'Remove Negative Keyword' : 'Add Negative Keyword'}
          </Button>
  )
}

export default NegativeKeywordButton