import { call } from '../core'

export async function getAdsReports() {
  return call('amazon/ads/reports', {
    method: 'GET'
  })
}

export async function getAdsReport(reportId) {
  return call(`amazon/ads/reports/${reportId}`, {
    method: 'GET'
  })
}

export async function getTaggedAdsReport(reportId) {
  return call(`amazon/ads/reports/${reportId}/tags`, {
    method: 'GET'
  })
}

export async function createAdsReport(body) {
  return call('amazon/ads/reports', {
    method: 'POST',
    body
  })
}

export async function deleteAdsReport(reportId) {
  return call(`amazon/ads/reports/${reportId}`, {
    method: 'DELETE'
  })
}
