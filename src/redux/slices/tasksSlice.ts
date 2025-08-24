import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Task, TaskId, ColumnId } from "@/types/kanban"
import { getCurrentISODate } from "@/utils/date"

interface TasksState {
  tasks: Record<TaskId, Task>
  manualOrder: Record<ColumnId, TaskId[]>
}

const initialState: TasksState = {
  tasks: {},
  manualOrder: {
    todo: [],
    inProgress: [],
    done: [],
  },
}


const createSampleTasks = (): TasksState => {
  const now = getCurrentISODate()
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)

  const sampleTasks: Task[] = [
    {
      id: "1",
      title: "Design user interface mockups",
      description: "Create wireframes and mockups for the new dashboard feature",
      priority: "High",
      dueDate: now.split("T")[0], // Today
      column: "todo",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "2",
      title: "Set up project repository",
      description: "Initialize Git repository and set up CI/CD pipeline",
      priority: "Medium",
      dueDate: tomorrow.toISOString().split("T")[0],
      column: "todo",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "3",
      title: "Implement authentication system",
      description: "Add user login and registration functionality",
      priority: "High",
      dueDate: nextWeek.toISOString().split("T")[0],
      column: "inProgress",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "4",
      title: "Write project documentation",
      description: "Create comprehensive README and API documentation",
      priority: "Low",
      dueDate: nextWeek.toISOString().split("T")[0],
      column: "done",
      createdAt: now,
      updatedAt: now,
    },
  ]

  const tasks: Record<TaskId, Task> = {}
  const manualOrder: Record<ColumnId, TaskId[]> = {
    todo: [],
    inProgress: [],
    done: [],
  }

  sampleTasks.forEach((task) => {
    tasks[task.id] = task
    manualOrder[task.column].push(task.id)
  })

  return { tasks, manualOrder }
}

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, "id" | "createdAt" | "updatedAt">>) => {
      const id = crypto.randomUUID()
      const now = getCurrentISODate()
      const task: Task = {
        ...action.payload,
        id,
        createdAt: now,
        updatedAt: now,
      }
      state.tasks[id] = task
      state.manualOrder[task.column].push(id)
    },
    updateTask: (state, action: PayloadAction<{ id: TaskId; updates: Partial<Omit<Task, "id" | "createdAt">> }>) => {
      const { id, updates } = action.payload
      if (state.tasks[id]) {
        const oldColumn = state.tasks[id].column
        state.tasks[id] = {
          ...state.tasks[id],
          ...updates,
          updatedAt: getCurrentISODate(),
        }


        if (updates.column && updates.column !== oldColumn) {
          state.manualOrder[oldColumn] = state.manualOrder[oldColumn].filter((taskId) => taskId !== id)
          state.manualOrder[updates.column].push(id)
        }
      }
    },
    deleteTask: (state, action: PayloadAction<TaskId>) => {
      const taskId = action.payload
      const task = state.tasks[taskId]
      if (task) {
        delete state.tasks[taskId]
        state.manualOrder[task.column] = state.manualOrder[task.column].filter((id) => id !== taskId)
      }
    },
    moveTask: (
      state,
      action: PayloadAction<{
        taskId: TaskId
        sourceColumn: ColumnId
        destinationColumn: ColumnId
        destinationIndex: number
      }>,
    ) => {
      const { taskId, sourceColumn, destinationColumn, destinationIndex } = action.payload


      state.manualOrder[sourceColumn] = state.manualOrder[sourceColumn].filter((id) => id !== taskId)


      state.manualOrder[destinationColumn].splice(destinationIndex, 0, taskId)


      if (state.tasks[taskId]) {
        state.tasks[taskId].column = destinationColumn
        state.tasks[taskId].updatedAt = getCurrentISODate()
      }
    },
    seedSampleTasks: (state) => {
      if (Object.keys(state.tasks).length === 0) {
        const sampleData = createSampleTasks()
        state.tasks = sampleData.tasks
        state.manualOrder = sampleData.manualOrder
      }
    },
    reorderTasks: (
      state,
      action: PayloadAction<{
        column: ColumnId
        startIndex: number
        endIndex: number
      }>,
    ) => {
      const { column, startIndex, endIndex } = action.payload
      const columnTasks = [...state.manualOrder[column]]
      const [removed] = columnTasks.splice(startIndex, 1)
      columnTasks.splice(endIndex, 0, removed)
      state.manualOrder[column] = columnTasks
    },
  },
})

export const { addTask, updateTask, deleteTask, moveTask, seedSampleTasks, reorderTasks } = tasksSlice.actions
