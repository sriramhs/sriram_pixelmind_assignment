import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import type { Task, Priority, ColumnId } from "@/types/kanban"
import { PRIORITY_OPTIONS, COLUMNS } from "@/constants/kanban"
import { formatDateForInput } from "@/utils/date"

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (taskData: TaskFormData) => void
  task?: Task | null
  defaultColumn?: ColumnId
}

export interface TaskFormData {
  title: string
  description: string
  priority: Priority
  dueDate: string
  column: ColumnId
}

export function TaskForm({ isOpen, onClose, onSubmit, task, defaultColumn = "todo" }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: new Date().toISOString().split("T")[0],
    column: defaultColumn,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const titleInputRef = useRef<HTMLInputElement>(null)
  const firstErrorRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData({
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: formatDateForInput(task.dueDate),
          column: task.column,
        })
      } else {
        setFormData({
          title: "",
          description: "",
          priority: "Medium",
          dueDate: new Date().toISOString().split("T")[0],
          column: defaultColumn,
        })
      }
      setErrors({})
      setIsSubmitting(false)

      setTimeout(() => {
        titleInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, task, defaultColumn])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      firstErrorRef.current?.focus()
    }
  }, [errors])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long"
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required"
    } else {
      const selectedDate = new Date(formData.dueDate)
      if (isNaN(selectedDate.getTime())) {
        newErrors.dueDate = "Please enter a valid date"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      onSubmit(formData)
      onClose()
    } catch (error) {
      console.error("Failed to submit task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && !isSubmitting) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle id="task-form-title">{task ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" role="form" aria-labelledby="task-form-title">
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive" role="alert" aria-live="polite">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please fix the following errors:
                <ul className="mt-1 list-disc list-inside">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              ref={errors.title ? firstErrorRef : titleInputRef}
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter task title"
              className={errors.title ? "border-destructive" : ""}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
              disabled={isSubmitting}
              required
            />
            {errors.title && (
              <p id="title-error" className="text-sm text-destructive" role="alert">
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter task description (optional)"
              rows={3}
              disabled={isSubmitting}
              aria-describedby="description-hint"
            />
            <p id="description-hint" className="text-xs text-muted-foreground">
              Optional: Add more details about this task
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Priority) => handleInputChange("priority", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="priority" aria-label="Select task priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="column">Column</Label>
              <Select
                value={formData.column}
                onValueChange={(value: ColumnId) => handleInputChange("column", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="column" aria-label="Select task column">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLUMNS.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
              className={errors.dueDate ? "border-destructive" : ""}
              aria-invalid={!!errors.dueDate}
              aria-describedby={errors.dueDate ? "dueDate-error" : undefined}
              disabled={isSubmitting}
              required
            />
            {errors.dueDate && (
              <p id="dueDate-error" className="text-sm text-destructive" role="alert">
                {errors.dueDate}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} aria-describedby="submit-status">
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {task ? "Update Task" : "Add Task"}
            </Button>
            <span id="submit-status" className="sr-only" aria-live="polite">
              {isSubmitting ? "Submitting task..." : ""}
            </span>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
