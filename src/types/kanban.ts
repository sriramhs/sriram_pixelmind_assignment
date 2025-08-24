export type TaskId = string
export type ColumnId = "todo" | "inProgress" | "done"
export type Priority = "Low" | "Medium" | "High"

export interface Task {
  id: TaskId
  title: string
  description: string
  priority: Priority
  dueDate: string 
  column: ColumnId
  createdAt: string 
  updatedAt: string 
}

export interface KanbanState {
  tasks: Record<TaskId, Task>
  columnOrder: ColumnId[]
  manualOrder: Record<ColumnId, TaskId[]>
  filters: {
    mode: "all" | "high" | "today"
    search: string
  }
  preferences: {
    theme: "light" | "dark" 
  }
  sorting: {
    by: Record<ColumnId, "manual" | "dueDate" | "priority">
  }
}

export interface Column {
  id: ColumnId
  title: string
}
