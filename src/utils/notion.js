export function getProp (value) {
  if (!value) return
  switch (value.type) {
    case 'title':
      return value.title[0]?.plainText
    case 'rich_text':
      return value.richText[0]?.plainText
    case 'number':
      return value.number
    case 'formula':
      return getProp(value.formula)
    default:
      return value.plainText
  }
}

function getProps (page, properties, nameMap={}) {
  const massaged = {}
  if (page) {
    for (const [key, value] of Object.entries(page.properties)) {
      if (properties.includes(key)) {
        massaged[nameMap[key] || key] = getProp(value)
      }
    }
  }
  return massaged
}

const notion = {
  getProp,
  getProps
}

export default notion
