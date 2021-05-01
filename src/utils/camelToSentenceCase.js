function camelToSentenceCase (str) {
  const sentenceCase = str.replace(/([A-Z])/g, ' $1')
  return sentenceCase[0].toUpperCase() + sentenceCase.slice(1)
}

export default camelToSentenceCase
