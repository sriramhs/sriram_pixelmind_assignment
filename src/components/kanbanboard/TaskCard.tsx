import type React from "react"

import { Draggable } from "@hello-pangea/dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Edit, Trash2, GripVertical } from "lucide-react"
import type { Task } from "@/types/kanban"
import { formatDate } from "@/utils/date"
import { getPriorityColor } from "@/utils/priorities"

interface TaskCardProps {
  task: Task
  index: number
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

export function TaskCard({ task, index, onEdit, onDelete }: TaskCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(task)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(task.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onEdit(task)
    }
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`cursor-pointer hover:shadow-md transition-all group focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
            snapshot.isDragging ? "shadow-lg rotate-2 bg-card/95" : ""
          }`}
          role="article"
          aria-label={`Task: ${task.title}`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <CardContent className="p-4" {...provided.dragHandleProps}>
            <div className="flex items-start justify-between mb-2"  >
              <div className="flex items-start gap-2 flex-1" >
                <div
                  className="mt-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                  aria-label="Drag to reorder task"
                  role="button"
                  tabIndex={-1}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-sm leading-tight flex-1 pr-2"  >{task.title}</h3>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleEdit}
                  aria-label={`Edit task: ${task.title}`}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:text-destructive"
                  onClick={handleDelete}
                  aria-label={`Delete task: ${task.title}`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {task.description && (
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2 ml-6" aria-label="Task description">
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between ml-6">
              <Badge
                variant="secondary"
                className={`text-xs ${getPriorityColor(task.priority)}`}
                aria-label={`Priority: ${task.priority}`}
              >
                {task.priority}
              </Badge>

              <div className="flex items-center gap-1 text-xs text-muted-foreground" aria-label="Due date">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                <time dateTime={task.dueDate}>{formatDate(task.dueDate)}</time>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  )
}
