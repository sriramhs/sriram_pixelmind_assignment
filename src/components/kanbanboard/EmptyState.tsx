import {  Search, Filter } from "lucide-react"

import type { ColumnId } from "@/types/kanban"

interface EmptyStateProps {
  column: ColumnId
  onAddTask: () => void
  hasFilters: boolean
}

export function EmptyState({ column, hasFilters }: EmptyStateProps) {
  



  const getEmptyMessage = () => {
    if (hasFilters) {
      return "No tasks match the current filters"
    }

    switch (column) {
      case "todo":
        return "No tasks to do yet"
      case "inProgress":
        return "No tasks in progress"
      case "done":
        return "No completed tasks"
      default:
        return "No tasks"
    }
  }

  const getEmptyIcon = () => {
    if (hasFilters) {
      return <Search className="h-8 w-8 text-muted-foreground mb-2" />
    }
    return <Filter className="h-8 w-8 text-muted-foreground mb-2" />
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center min-h-[150px]">
      {getEmptyIcon()}
      <p className="text-muted-foreground text-sm mb-4">{getEmptyMessage()}</p>

    </div>
  )
}
