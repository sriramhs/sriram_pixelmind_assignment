const STORAGE_KEYS = {
  TASKS: "kanban.tasks.v1",
  PREFERENCES: "kanban.preferences.v1",
} as const

export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window === 'undefined') return defaultValue
    const item = localStorage.getItem(key)
    if (!item) return defaultValue
    
    const parsed = JSON.parse(item)
    console.log(`[Storage] Retrieved ${key}:`, parsed)
    return parsed
  } catch (error) {
    console.warn(`[Storage] Failed to get ${key} from localStorage:`, error)
    return defaultValue
  }
}

export const setToStorage = <T>(key: string, value: T): void => {
  try {
    if (typeof window === 'undefined') return
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
    console.log(`[Storage] Saved ${key}:`, value)
  } catch (error) {
    console.warn(`[Storage] Failed to set ${key} to localStorage:`, error)
  }
}

export const removeFromStorage = (key: string): void => {
  try {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
    console.log(`[Storage] Removed ${key} from localStorage`)
  } catch (error) {
    console.warn(`[Storage] Failed to remove ${key} from localStorage:`, error)
  }
}

export const clearAllStorage = (): void => {
  try {
    if (typeof window === 'undefined') return
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    console.log("[Storage] Cleared all kanban data from localStorage")
  } catch (error) {
    console.warn("[Storage] Failed to clear localStorage:", error)
  }
}

export const getStorageInfo = () => {
  try {
    if (typeof window === 'undefined') return null
    
    const info = {
      hasTasksData: !!localStorage.getItem(STORAGE_KEYS.TASKS),
      hasPreferencesData: !!localStorage.getItem(STORAGE_KEYS.PREFERENCES),
      totalKeys: Object.values(STORAGE_KEYS).filter(key => localStorage.getItem(key)).length,
    }
    
    console.log("[Storage] Storage info:", info)
    return info
  } catch (error) {
    console.warn("[Storage] Failed to get storage info:", error)
    return null
  }
}

export const STORAGE = STORAGE_KEYS
