import { NOTION_PROXY_HOST } from '../constants'
import { getSavedTokens } from './auth'
import { deepToCamelCase } from './deepMap'

async function callNotion (path, method) {
  const tokens = await getSavedTokens()
  const token = tokens.notion
  const res = await fetch(`${NOTION_PROXY_HOST}/${path}`, {
    method: method || 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': '2021-08-16'
    }
  }).then(res => res.json())
  return deepToCamelCase(res)
}

export default callNotion
