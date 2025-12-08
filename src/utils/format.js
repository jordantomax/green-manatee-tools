export function toLocationLabel (location) {
  return (
    {
      fba: 'FBA',
      awd: 'AWD',
      warehouse: 'Warehouse',
    }[location]
  ) || 'No restock needed'
}

