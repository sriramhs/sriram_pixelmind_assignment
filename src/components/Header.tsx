import { ProgressBar } from "./ProgressBar"
import { ThemeToggle } from "./ThemeToggle"
import { FilterPanel } from "./kanbanboard/FilterPanel"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { TaskForm, type TaskFormData } from "./kanbanboard/TaskForm"
import { useAppDispatch } from "@/redux/hooks"
import { addTask } from "@/redux/slices/tasksSlice"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

export function Header() {
  const dispatch = useAppDispatch()
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)

  const handleAddTask = () => {
    setIsTaskFormOpen(true)
  }

  const handleTaskFormSubmit = (taskData: TaskFormData) => {
    dispatch(addTask(taskData))
  }

  const closeTaskForm = () => {
    setIsTaskFormOpen(false)
  }


  return (
    <>
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Mini Kanban Board</h1>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleAddTask} size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Task
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add new task</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <ThemeToggle />
            </div>
          </div>

        

          <ProgressBar />
          <div className="mt-4">
            <FilterPanel />
          </div>
        </div>
      </header>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={closeTaskForm}
        onSubmit={handleTaskFormSubmit}
        task={null}
        defaultColumn="todo"
      />

    </>
  )
}
