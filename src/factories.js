export function addressFactory () {
  return {
    name: '',
    company: '',
    street1: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: '',
    email: ''
  }
}

export function parcelFactory () {
  return {
    id: Math.random().toString(36).substring(7),
    length: '',
    width: '',
    height: '',
    distanceUnit: 'in',
    weight: '',
    massUnit: 'lb',
    quantity: 1
  }
}
