import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { RECORD_TYPES } from '../../src/utils/constants'
import { filterFactory } from './filterFactory'
import { sortFactory } from './sortFactory'

export const viewFactory = Factory.define(({ sequence, transientParams }) => {
  const { withFilters = false, withSorts = false } = transientParams

  return {
    id: String(sequence),
    name: faker.commerce.productName(),
    resourceType: faker.helpers.objectValue(RECORD_TYPES),
    filter: withFilters
      ? [filterFactory.build()]
      : null,
    sort: withSorts
      ? [sortFactory.build()]
      : null,
  }
})