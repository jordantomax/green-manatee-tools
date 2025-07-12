export const validators = {
  required: (fieldName) => (value) => (!value ? `${fieldName} is required` : null),
}

export default validators