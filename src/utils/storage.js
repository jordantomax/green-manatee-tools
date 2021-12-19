export function setLocalData (key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function getLocalData (key) {
  const item = window.localStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

export function removeLocalData (key) {
  window.localStorage.removeItem(key)
}
