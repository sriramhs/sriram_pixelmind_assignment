import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface FiltersState {
  mode: "all" | "high" | "today"
  search: string
}

const initialState: FiltersState = {
  mode: "all",
  search: "",
}

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilterMode: (state, action: PayloadAction<FiltersState["mode"]>) => {
      state.mode = action.payload
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    clearFilters: (state) => {
      state.mode = "all"
      state.search = ""
    },
  },
})

export const { setFilterMode, setSearch, clearFilters } = filtersSlice.actions
