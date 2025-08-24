import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ColumnId } from "@/types/kanban"

interface SortingState {
  by: Record<ColumnId, "manual" | "dueDate" | "priority">
}

const initialState: SortingState = {
  by: {
    todo: "manual",
    inProgress: "manual",
    done: "manual",
  },
}

export const sortingSlice = createSlice({
  name: "sorting",
  initialState,
  reducers: {
    setSortBy: (state, action: PayloadAction<{ column: ColumnId; sortBy: "manual" | "dueDate" | "priority" }>) => {
      const { column, sortBy } = action.payload
      state.by[column] = sortBy
    },
  },
})

export const { setSortBy } = sortingSlice.actions
