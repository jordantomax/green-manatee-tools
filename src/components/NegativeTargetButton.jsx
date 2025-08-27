import isFunction from 'lodash-es/isFunction'

import api from '@/api'
import { useAsync } from '@/hooks/useAsync'
import { Button } from '@mantine/core'
import { NEGATIVE_TARGET_EXPRESSION_TYPES } from '@/utils/constants'

const NegativeTargetButton = ({ 
  negativeTarget,
  onSuccess,
  campaignId,
  adGroupId,
  asin,
  expressionType=NEGATIVE_TARGET_EXPRESSION_TYPES.ASIN_SAME_AS,
  isLoading: externalLoading
}) => {
  const { run, isLoading } = useAsync()

  
  const createNegativeTarget = () => {
    run(async () => {
      const { targetId } = await api.createNegativeTarget({ 
        campaignId, 
        adGroupId,
        expressionValue: asin,
        expressionType
      })
      isFunction(onSuccess) && onSuccess()
    })
  }
  
  const deleteNegativeTarget = () => {
    run(async () => {
      await api.deleteNegativeTarget(negativeTarget.targetId)
      isFunction(onSuccess) && onSuccess()
    })
  }

  return (
    <Button 
      disabled={isLoading || externalLoading}
      loading={isLoading || externalLoading} 
      variant="default"
      size="xs"
      onClick={negativeTarget ? deleteNegativeTarget : createNegativeTarget}
    >
      {negativeTarget ? 'Remove Negative Target' : 'Add Negative Target'}
    </Button>
  )
}

export default NegativeTargetButton