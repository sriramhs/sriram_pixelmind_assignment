import type { Middleware } from "@reduxjs/toolkit"
import type { RootState } from "../store"
import { getFromStorage, setToStorage, STORAGE } from "@/utils/storage"

// Debounce function to avoid excessive localStorage writes
const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): T => {
  let timeoutId: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }) as T
}

const saveToStorage = debounce((state: RootState) => {
  try {
    // Save tasks and manual order
    setToStorage(STORAGE.TASKS, {
      tasks: state.tasks.tasks,
      manualOrder: state.tasks.manualOrder,
    })

    // Save preferences, filters, and sorting
    setToStorage(STORAGE.PREFERENCES, {
      preferences: state.preferences,
      filters: state.filters,
      sorting: state.sorting,
    })

    console.log("[Kanban] State persisted to localStorage")
  } catch (error) {
    console.warn("[Kanban] Failed to persist state:", error)
  }
}, 300)

export const persistenceMiddleware: Middleware<{}, RootState> = (store) => (next) => (action:any) => {
  const result = next(action)

  // Save state after any action that might change persisted data
  if (
    action.type.startsWith("tasks/") ||
    action.type.startsWith("preferences/") ||
    action.type.startsWith("filters/") ||
    action.type.startsWith("sorting/")
  ) {
    saveToStorage(store.getState())
  }

  return result
}

export const loadPersistedState:any = (): Partial<RootState> => {
  try {
    const tasksData:any = getFromStorage(STORAGE.TASKS, null)
    const preferencesData:any = getFromStorage(STORAGE.PREFERENCES, null)

    const state: Partial<RootState> = {}

    if (tasksData) {
      state.tasks  = {
        tasks: tasksData.tasks || {},
        manualOrder: tasksData.manualOrder || {
          todo: [],
          inProgress: [],
          done: [],
        },
      }
      console.log("[Kanban] Loaded tasks from localStorage:", Object.keys(tasksData.tasks || {}).length, "tasks")
    }

    if (preferencesData) {
      if (preferencesData.preferences) {
        state.preferences = preferencesData.preferences
        console.log("[Kanban] Loaded preferences from localStorage:", preferencesData.preferences)
      }
      if (preferencesData.filters) {
        state.filters = preferencesData.filters
        console.log("[Kanban] Loaded filters from localStorage:", preferencesData.filters)
      }
      if (preferencesData.sorting) {
        state.sorting = preferencesData.sorting
        console.log("[Kanban] Loaded sorting from localStorage:", preferencesData.sorting)
      }
    }

    return state
  } catch (error) {
    console.warn("[Kanban] Failed to load persisted state:", error)
    return {}
  }
}
