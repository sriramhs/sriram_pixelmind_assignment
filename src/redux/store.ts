import { configureStore } from "@reduxjs/toolkit"
import { tasksSlice } from "./slices/tasksSlice"
import { filtersSlice } from "./slices/filtersSlice"
import { preferencesSlice } from "./slices/preferencesSlice"
import { sortingSlice } from "./slices/sortingSlice"
import { persistenceMiddleware, loadPersistedState } from "./middleware/persistenceMiddleware"


const preloadedState = loadPersistedState()

export const store = configureStore({
  reducer : {
    tasks: tasksSlice.reducer,
    filters: filtersSlice.reducer,
    preferences: preferencesSlice.reducer,
    sorting: sortingSlice.reducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(persistenceMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
