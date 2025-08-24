import { useAppSelector } from "@/redux/hooks"
import { selectProgress } from "@/redux/selectors"


export function ProgressBar() {
  const { doneCount, totalCount, percent } = useAppSelector(selectProgress)

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Task completion progress"
    >
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>Progress</span>
        <span aria-live="polite">
          {doneCount}/{totalCount} tasks ({percent}%)
        </span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="sr-only" aria-live="polite">
        {percent === 100 ? "All tasks completed!" : `${percent}% of tasks completed`}
      </div>
    </div>
  )
}
