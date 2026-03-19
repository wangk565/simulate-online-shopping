function getLocalStorage() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null
  }

  return window.localStorage
}

export function getStorage(key, defaultValue = null) {
  const storage = getLocalStorage()

  if (!storage) {
    return defaultValue
  }

  const value = storage.getItem(key)

  if (value === null) {
    return defaultValue
  }

  try {
    return JSON.parse(value)
  } catch {
    return defaultValue
  }
}

export function setStorage(key, value) {
  const storage = getLocalStorage()

  if (!storage) {
    return
  }

  storage.setItem(key, JSON.stringify(value))
}

export function removeStorage(key) {
  const storage = getLocalStorage()

  if (!storage) {
    return
  }

  storage.removeItem(key)
}

export function clearStorage() {
  const storage = getLocalStorage()

  if (!storage) {
    return
  }

  storage.clear()
}

export default {
  getStorage,
  setStorage,
  removeStorage,
  clearStorage,
}
