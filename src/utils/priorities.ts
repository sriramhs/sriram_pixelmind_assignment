import type { Priority } from "@/types/kanban"

const priorityOrder: Record<Priority, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
}

export const comparePriority = (a: Priority, b: Priority): number => {
  return priorityOrder[b] - priorityOrder[a] // High priority first
}

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "Low":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }
}
