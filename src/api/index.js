// Export all modules using wildcards
export * from './core'
export * from './auth'
export * from './inventory'
export * from './shipping'
export * from './amazon-ads'
export * from './views'

// Legacy API object for backward compatibility
import * as core from './core'
import * as auth from './auth'
import * as inventory from './inventory'
import * as shipping from './shipping'
import * as amazonAds from './amazon-ads'
import * as views from './views'

const api = {
  ...core,
  ...auth,
  ...inventory,
  ...shipping,
  ...amazonAds,
  ...views
}

export default api
