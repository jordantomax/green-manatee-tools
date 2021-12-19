function idFactory () {
  return Math.random().toString(36).substring(7)
}

export function addressFactory () {
  return {
    id: idFactory(),
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
    id: idFactory(),
    length: '',
    width: '',
    height: '',
    distanceUnit: 'in',
    weight: '',
    massUnit: 'lb',
    quantity: 1
  }
}

export function customsFactory () {
  return {
    id: idFactory(),
    certifySigner: '',
    certify: true,
    description: '',
    items: [customsItemFactory()],
    nonDeliveryOption: 'RETURN',
    contentsType: 'MERCHANDISE'
  }
}

export function customsItemFactory () {
  return {
    id: idFactory(),
    description: '',
    quantity: 0,
    netWeight: '',
    massUnit: 'lb',
    valueAmount: '',
    valueCurrency: 'USD',
    tariffNumber: '',
    originCountry: 'US'
  }
}
