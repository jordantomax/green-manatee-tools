import { subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, format } from 'date-fns'

const today = new Date()
const yesterday = subDays(today, 1)
const formatDate = (date) => format(date, 'yyyy-MM-dd')

export const dateRangePresets = [
  {
    value: [formatDate(subDays(yesterday, 6)), formatDate(yesterday)],
    label: 'Last 7 days',
  },
  {
    value: [formatDate(subDays(yesterday, 29)), formatDate(yesterday)],
    label: 'Last 30 days',
  },
  {
    value: [formatDate(subDays(yesterday, 59)), formatDate(yesterday)],
    label: 'Last 60 days',
  },
  {
    value: [formatDate(subDays(yesterday, 89)), formatDate(yesterday)],
    label: 'Last 90 days',
  },
  {
    value: [formatDate(new Date(2020, 0, 1)), formatDate(yesterday)],
    label: 'All time',
  },
]