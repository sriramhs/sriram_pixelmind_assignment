import { useState } from "react"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import { Column } from "./Column"
import { TaskForm, type TaskFormData } from "./TaskForm"
import { ConfirmDialog } from "../ConfirmDialog"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectTasksByColumn, selectFilters } from "@/redux/selectors"
import { updateTask, addTask, deleteTask, reorderTasks, moveTask } from "@/redux/slices/tasksSlice"
import type { ColumnId, Task } from "@/types/kanban"
import { COLUMNS } from "@/constants/kanban"

export function Board() {
  const dispatch = useAppDispatch()
  const tasksByColumn = useAppSelector(selectTasksByColumn)
  const filters = useAppSelector(selectFilters)

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [defaultColumn, setDefaultColumn] = useState<ColumnId>("todo")
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; taskId: string; taskTitle: string }>({
    isOpen: false,
    taskId: "",
    taskTitle: "",
  })

  const hasActiveFilters = filters.mode !== "all" || filters.search.length > 0

  const handleAddTask = (column: ColumnId) => {
    setDefaultColumn(column)
    setEditingTask(null)
    setIsTaskFormOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskFormOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    const task = Object.values(tasksByColumn)
      .flat()
      .find((t) => t.id === taskId)
    if (task) {
      setDeleteConfirm({
        isOpen: true,
        taskId,
        taskTitle: task.title,
      })
    }
  }

  const handleTaskFormSubmit = (taskData: TaskFormData) => {
    if (editingTask) {
      dispatch(updateTask({ id: editingTask.id, updates: taskData }))
    } else {
      dispatch(addTask(taskData))
    }
  }

  const handleConfirmDelete = () => {
    dispatch(deleteTask(deleteConfirm.taskId))
  }

  const closeTaskForm = () => {
    setIsTaskFormOpen(false)
    setEditingTask(null)
  }

  const closeDeleteConfirm = () => {
    setDeleteConfirm({ isOpen: false, taskId: "", taskTitle: "" })
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result


    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const sourceColumn = source.droppableId as ColumnId
    const destinationColumn = destination.droppableId as ColumnId

    if (sourceColumn === destinationColumn) {
      dispatch(
        reorderTasks({
          column: sourceColumn,
          startIndex: source.index,
          endIndex: destination.index,
        }),
      )
    } else {
      dispatch(
        moveTask({
          taskId: draggableId,
          sourceColumn,
          destinationColumn,
          destinationIndex: destination.index,
        }),
      )
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((column: { id: ColumnId; title: string }) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasksByColumn[column.id]}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              hasFilters={hasActiveFilters}
            />
          ))}
        </div>
      </DragDropContext>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={closeTaskForm}
        onSubmit={handleTaskFormSubmit}
        task={editingTask}
        defaultColumn={defaultColumn}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={closeDeleteConfirm}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        description={`Are you sure you want to delete ?`}
      />
    </>
  )
}
