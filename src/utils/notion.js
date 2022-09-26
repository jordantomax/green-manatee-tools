import { NOTION_PROXY_HOST } from '../constants'
import { getSavedTokens } from './auth'
import { deepToCamelCase } from './deepMap'

async function call (path, _options = {}) {
  const { method, params } = _options
  const tokens = await getSavedTokens()
  const token = tokens.notion
  const options = {
    method: method || 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2021-08-16'
    }
  }
  if (options.method !== 'GET') {
    options.body = JSON.stringify(params || {})
  }

  const res = await fetch(`${NOTION_PROXY_HOST}/${path}`, options).then(res => res.json())
  return deepToCamelCase(res)
}

async function dbQuery (id, params) {
  const res = await call(`databases/${id}/query`, {
    method: 'POST',
    params
  })
  return res
}

async function pageRetrieve (id) {
  const res = await call(`pages/${id}`)
  return res
}

function getPropValueText (value) {
  switch (value.type) {
    case 'title':
      return value.title[0]?.plainText
    case 'rich_text':
      return value.richText[0]?.plainText
    case 'number':
      return value.number
    case 'formula':
      return getPropValueText(value.formula)
    default:
      return value.plainText
  }
}

function massagePage (page, properties, nameMap) {
  const massaged = {}
  if (page) {
    for (const [key, value] of Object.entries(page.properties)) {
      if (properties.includes(key)) {
        massaged[nameMap[key] || key] = getPropValueText(value)
      }
    }
  }
  return massaged
}

const notion = {
  call,
  dbQuery,
  pageRetrieve,
  massagePage
}

export default notion
