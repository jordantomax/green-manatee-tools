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

async function pageGet (id) {
  const res = await call(`pages/${id}`)
  return res
}

async function relationsGet (obj, relationNames) {
  const relations = await Promise.all(
    relationNames.map(async (prop) => {
      if (!obj.properties[prop] || obj.properties[prop].relation.length <= 0) return null

      return await Promise.all(
        // accomodate multiple  per shipment
        obj.properties[prop].relation.map(async (r) => {
          if (!r.id) return null
          return await pageGet(r.id)
        })
      )
    })
  )
  return relations
}

export function getNotionProp (value) {
  if (!value) return
  switch (value.type) {
    case 'title':
      return value.title[0]?.plainText
    case 'rich_text':
      return value.richText[0]?.plainText
    case 'number':
      return value.number
    case 'formula':
      return getNotionProp(value.formula)
    default:
      return value.plainText
  }
}

function massagePage (page, properties, nameMap) {
  const massaged = {}
  if (page) {
    for (const [key, value] of Object.entries(page.properties)) {
      if (properties.includes(key)) {
        massaged[nameMap[key] || key] = getNotionProp(value)
      }
    }
  }
  return massaged
}

const notion = {
  call,
  dbQuery,
  pageGet,
  relationsGet,
  massagePage
}

export default notion
