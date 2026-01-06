import { call } from './core'

export async function createManifest (shipments, manifestType) {
  const res = await call(`amazon/sp/manifest`, {
    method: 'POST',
    body: {
      shipments,
      manifestType
    }
  })
  const base64Txt = res.body
  const link = document.createElement('a')
  link.href = `data:application/pdf;base64,${base64Txt}`
  link.download = `manifest-${manifestType}.xlsx`
  link.click()
}

export async function shippoGetRates (body) {
  return call(`shippo/rates`, {
    method: 'POST',
    body
  })
}

export async function shippoPurchaseLabel (body) {
  return call(`shippo/label`, {
    method: 'POST',
    body
  })
}

export async function shippoGetLabels (rateId) {
  return call(`shippo/label/${rateId}`, {
    method: 'GET'
  })
}

export async function mergePdfs (body) {
  const res = await call(`shippo/merge-pdfs`, {
    method: 'POST',
    body
  })
  const link = document.createElement('a')
  link.href = `data:application/pdf;base64,${res.body}`
  link.download = 'postage.pdf'
  link.click()
  return res
}
