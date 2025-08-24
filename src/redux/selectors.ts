import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "./store"
import type { Task, ColumnId } from "@/types/kanban"
import { isToday } from "@/utils/date"
import { comparePriority } from "@/utils/priorities"


export const selectTasks = (state: RootState) => state.tasks.tasks
export const selectManualOrder = (state: RootState) => state.tasks.manualOrder
export const selectFilters = (state: RootState) => state.filters
export const selectSorting = (state: RootState) => state.sorting


export const selectAllTasks = createSelector([selectTasks], (tasks) => Object.values(tasks))

export const selectFilteredTasks = createSelector([selectAllTasks, selectFilters], (tasks, filters) => {
  return tasks.filter((task:any) => {

    if (filters.mode === "high" && task.priority !== "High") return false
    if (filters.mode === "today" && !isToday(task.dueDate)) return false

 
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const titleMatch = task.title.toLowerCase().includes(searchTerm)
      const descriptionMatch = task.description.toLowerCase().includes(searchTerm)
      if (!titleMatch && !descriptionMatch) return false
    }

    return true
  })
})

export const selectTasksByColumn = createSelector(
  [selectTasks, selectManualOrder, selectFilteredTasks, selectSorting],
  (tasks, manualOrder, filteredTasks, sorting) => {
    const result: Record<ColumnId, Task[]> = {
      todo: [],
      inProgress: [],
      done: [],
    }


    const filteredTaskIds = new Set(filteredTasks.map((task:any) => task.id))


    Object.entries(manualOrder).forEach(([columnId, taskIds]:any) => {
      const column = columnId as ColumnId
      const columnTasks = taskIds
        .map((id:any) => tasks[id])
        .filter(Boolean)
        .filter((task:any) => filteredTaskIds.has(task.id)) 

      // Apply sorting
      const sortBy = sorting.by[column]
      if (sortBy === "dueDate") {
        columnTasks.sort((a:any, b:any) => {
          const dateA = new Date(a.dueDate).getTime()
          const dateB = new Date(b.dueDate).getTime()
          if (dateA === dateB) return a.title.localeCompare(b.title)
          return dateA - dateB
        })
      } else if (sortBy === "priority") {
        columnTasks.sort((a:any, b:any) => {
          const priorityComparison = comparePriority(a.priority, b.priority)
          if (priorityComparison === 0) return a.title.localeCompare(b.title)
          return priorityComparison
        })
      }

      result[column] = columnTasks
    })

    return result
  },
)

export const selectProgress = createSelector([selectAllTasks], (tasks) => {
  const totalCount = tasks.length
  const doneCount = tasks.filter((task:any) => task.column === "done").length
  const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

  return { doneCount, totalCount, percent }
})

export const selectTaskById = (taskId: string) => createSelector([selectTasks], (tasks) => tasks[taskId] || null)

export const selectHighPriorityTasks = createSelector([selectAllTasks], (tasks) =>
  tasks.filter((task:any) => task.priority === "High"),
)

export const selectTasksDueToday = createSelector([selectAllTasks], (tasks) =>
  tasks.filter((task:any) => isToday(task.dueDate)),
)

export const selectSearchResultsCount = createSelector(
  [selectFilteredTasks, selectFilters],
  (filteredTasks, filters) => {
    if (!filters.search) return 0
    return filteredTasks.length
  },
)

export const selectFilterSummary = createSelector(
  [selectFilters, selectAllTasks, selectHighPriorityTasks, selectTasksDueToday, selectFilteredTasks],
  (filters, allTasks, highPriorityTasks, tasksDueToday, filteredTasks) => {
    return {
      hasActiveFilters: filters.mode !== "all" || filters.search.length > 0,
      totalTasks: allTasks.length,
      highPriorityCount: highPriorityTasks.length,
      dueTodayCount: tasksDueToday.length,
      filteredCount: filteredTasks.length,
      activeMode: filters.mode,
      searchTerm: filters.search,
    }
  },
)
