type Entry<T> = { at: number; ttl: number; value: T }
const store = new Map<string, Entry<any>>()

export function setCache<T>(key: string, value: T, ttlMs = 5 * 60_000) {
  store.set(key, { at: Date.now(), ttl: ttlMs, value })
}

export function getCache<T>(key: string): T | null {
  const ent = store.get(key)
  if (!ent) return null
  if (Date.now() - ent.at > ent.ttl) {
    store.delete(key)
    return null
  }
  return ent.value as T
}

export function clearCache(key?: string) {
  if (key) store.delete(key)
  else store.clear()
}
