import { useState, useEffect, useRef } from 'react'
import isEqual from 'lodash/isEqual'
import set from 'lodash/set'
import camelToSentenceCase from '../utils/camelToSentenceCase'
import shippo from 'shippo'

import { getSavedToken } from '../utils/auth'
import { deepToSnakeCase } from '../utils/deepMap'
import validate from '../utils/validation'

function _validateInput (input, required, setErrors) {
  const errors = {}
  let isValid = true
  for (const key in input) {
    if (required.includes(key) && !input[key]) {
      errors[key] = `${camelToSentenceCase(key)} can not be blank`
      isValid = false
    } else if (input[key] && !validate(key, input[key])) {
      errors[key] = `Invalid ${camelToSentenceCase(key)}`
      isValid = false
    }
  }
  setErrors(errors)
  return isValid
}

function handleServerError (error, setErrors) {
  if (error.message) {
    setErrors({ form: 'There was a problem completing the requested action. Please try again soon, or contact us if the problem persists.' })
  } else if (Array.isArray(error) && error[0].message) {
    setErrors({ form: error[0].message })
  }
}

function useForm ({
  resource,
  action,
  defaultInput,
  required = [],
  afterChange,
  afterSubmit,
  massageInput
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState(defaultInput)
  const [errors, setErrors] = useState({})
  const ref = useRef(false)

  useEffect(() => {
    ref.current = true
    return () => { ref.current = false }
  }, [])

  function validateInput () {
    return _validateInput(input, required, setErrors)
  }

  function handleChange (e) {
    const { name, value } = e.target
    const update = Object.assign({}, input)
    set(update, name, value)
    setInput(update)
    afterChange && afterChange(update)
  }

  async function handleSubmit (e) {
    e && e.preventDefault && e.preventDefault()
    if (isLoading || !validateInput()) return
    setIsLoading(true)

    try {
      const finalInput = massageInput ? massageInput(input) : input
      const token = await getSavedToken()
      const session = shippo(token)

      const res = await session[resource][action](deepToSnakeCase(finalInput))
      console.log(res)
      afterSubmit && afterSubmit(res)
    } catch (serverErrors) {
      handleServerError(serverErrors, setErrors)
    } finally {
      if (ref.current) {
        setIsLoading(false)
      }
    }
  }

  return {
    input,
    errors,
    isLoading,
    isChanged: !isEqual(defaultInput, input),
    handleChange,
    handleSubmit
  }
}

export default useForm
