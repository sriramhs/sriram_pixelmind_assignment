import { Board } from "./Board"
import { Header } from "../Header"
import { useEffect } from "react"
import { useAppDispatch } from "@/redux/hooks"
import { seedSampleTasks } from "@/redux/slices/tasksSlice"

function KanbanContent() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // add sample task
    dispatch(seedSampleTasks())
  }, [dispatch])

  return (
   
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <Board />
        </main>
      </div>
  )
}

export function KanbanBoard() {
  return (
    
      <KanbanContent />
  )
}
