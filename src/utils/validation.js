const validators = {
  email: (email) => {
    return /\S+@\S+/.test(email)
  },
  citationUrl: (string) => {
    let url
    try {
      url = new URL(string)
    } catch (_) {
      return false
    }
    if (url) return true
  }
}

function validate (name, value) {
  if (!validators[name]) return true
  return validators[name](value)
}

export default validate
