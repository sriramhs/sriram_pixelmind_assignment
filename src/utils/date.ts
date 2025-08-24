import { format, isToday as dateFnsIsToday, parseISO } from "date-fns"

export const isToday = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString)
    return dateFnsIsToday(date)
  } catch {
    return false
  }
}

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString)
    return format(date, "MMM dd, yyyy")
  } catch {
    return "Invalid date"
  }
}

export const safeParseDate = (dateString: string): Date | null => {
  try {
    return parseISO(dateString)
  } catch {
    return null
  }
}

export const getCurrentISODate = (): string => {
  return new Date().toISOString()
}

export const formatDateForInput = (dateString: string): string => {
  try {
    const date = parseISO(dateString)
    return format(date, "yyyy-MM-dd")
  } catch {
    return ""
  }
}
