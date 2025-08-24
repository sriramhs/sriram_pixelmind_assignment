import type { Column, ColumnId } from "@/types/kanban"

export const COLUMNS: Column[] = [
  { id: "todo", title: "Todo" },
  { id: "inProgress", title: "In Progress" },
  { id: "done", title: "Done" },
]

export const COLUMN_ORDER: ColumnId[] = ["todo", "inProgress", "done"]

export const PRIORITY_OPTIONS = ["Low", "Medium", "High"] as const

export const FILTER_OPTIONS = [
  { value: "all", label: "All Tasks" },
  { value: "high", label: "High Priority" },
  { value: "today", label: "Due Today" },
] as const

export const SORT_OPTIONS = [
  { value: "manual", label: "Manual" },
  { value: "dueDate", label: "Due Date" },
  { value: "priority", label: "Priority" },
] as const
