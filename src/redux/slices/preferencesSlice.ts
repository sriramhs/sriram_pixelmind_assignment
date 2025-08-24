import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface PreferencesState {
  theme: "light" | "dark" 
}

const initialState: PreferencesState = {
  theme: "dark",
}

export const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<PreferencesState["theme"]>) => {
      state.theme = action.payload
    },
  },
})

export const { setTheme } = preferencesSlice.actions
