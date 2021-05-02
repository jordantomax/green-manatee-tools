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
    length: '',
    width: '',
    height: '',
    distance_unit: 'in',
    weight: '',
    mass_unit: 'lb'
  }
}
