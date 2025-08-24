import { Droppable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import type { Task, ColumnId } from "@/types/kanban"
import { TaskCard } from "./TaskCard"
import { EmptyState } from "./EmptyState"
import { SORT_OPTIONS } from "@/constants/kanban"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectSorting, selectFilterSummary } from "@/redux/selectors"
import { setSortBy } from "@/redux/slices/sortingSlice"

interface ColumnProps {
  id: ColumnId
  title: string
  tasks: Task[]
  onAddTask: (column: ColumnId) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  hasFilters: boolean
}

export function Column({ id, title, tasks, onAddTask, onEditTask, onDeleteTask, hasFilters }: ColumnProps) {
  const dispatch = useAppDispatch()
  const sorting = useAppSelector(selectSorting)
  const filterSummary = useAppSelector(selectFilterSummary)

  const handleSortChange = (sortBy: "manual" | "dueDate" | "priority") => {
    dispatch(setSortBy({ column: id, sortBy }))
  }

  const getTaskCountDisplay = () => {
    if (hasFilters && filterSummary.hasActiveFilters) {
      return (
        <span
          className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full"
          aria-label={`${tasks.length} tasks shown`}
        >
          {tasks.length}
          {filterSummary.searchTerm && <span className="ml-1 text-primary">filtered</span>}
        </span>
      )
    }
    return (
      <span
        className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full"
        aria-label={`${tasks.length} tasks`}
      >
        {tasks.length}
      </span>
    )
  }

  return (
    <Card className="flex flex-col h-fit" role="region" aria-labelledby={`column-${id}-title`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 id={`column-${id}-title`} className="font-semibold">
              {title}
            </h2>
            {getTaskCountDisplay()}
          </div>
          <Button
            onClick={() => onAddTask(id)}
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            aria-label={`Add new task to ${title}`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor={`sort-${id}`} className="text-xs text-muted-foreground">
            Sort by:
          </label>
          <Select value={sorting.by[id]} onValueChange={handleSortChange}>
            <SelectTrigger id={`sort-${id}`} className="h-7 text-xs" aria-label={`Sort ${title} column by`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        <Droppable droppableId={id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`space-y-3 min-h-[200px] p-2 rounded-lg transition-colors ${
                snapshot.isDraggingOver ? "bg-muted/50 ring-2 ring-primary/20" : ""
              }`}
              role="list"
              aria-label={`${title} tasks`}
              aria-describedby={`column-${id}-description`}
            >
              <div id={`column-${id}-description`} className="sr-only">
                {tasks.length === 0
                  ? `No tasks in ${title} column`
                  : `${tasks.length} task${tasks.length === 1 ? "" : "s"} in ${title} column`}
              </div>

              {tasks.length === 0 ? (
                <EmptyState column={id} onAddTask={() => onAddTask(id)} hasFilters={hasFilters} />
              ) : (
                tasks.map((task, index) => (
                  <div key={task.id} role="listitem">
                    <TaskCard task={task} index={index} onEdit={onEditTask} onDelete={onDeleteTask} />
                  </div>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  )
}
