import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectFilters, selectAllTasks, selectHighPriorityTasks, selectTasksDueToday } from "@/redux/selectors"
import { setFilterMode, setSearch, clearFilters } from "@/redux/slices/filtersSlice"

export function FilterPanel() {
  const dispatch = useAppDispatch()
  const { mode, search } = useAppSelector(selectFilters)
  const allTasks = useAppSelector(selectAllTasks)
  const highPriorityTasks = useAppSelector(selectHighPriorityTasks)
  const tasksDueToday = useAppSelector(selectTasksDueToday)

  const handleFilterChange = (newMode: "all" | "high" | "today") => {
    dispatch(setFilterMode(newMode))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(e.target.value))
  }

  const handleClearSearch = () => {
    dispatch(setSearch(""))
  }

  const handleClearAllFilters = () => {
    dispatch(clearFilters())
  }

  const hasActiveFilters = mode !== "all" || search.length > 0

  return (
    <div className="space-y-4" role="search" aria-label="Task filters and search">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter options">
          <Button
            variant={mode === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("all")}
            className="relative"
            aria-pressed={mode === "all"}
            aria-describedby="all-tasks-count"
          >
            <Filter className="h-3 w-3 mr-2" aria-hidden="true" />
            All Tasks
            <Badge
              variant="secondary"
              className="ml-2 text-xs"
              id="all-tasks-count"
              aria-label={`${allTasks.length} total tasks`}
            >
              {allTasks.length}
            </Badge>
          </Button>
          <Button
            variant={mode === "high" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("high")}
            className="relative"
            aria-pressed={mode === "high"}
            aria-describedby="high-priority-count"
          >
            High Priority
            <Badge
              variant="secondary"
              className="ml-2 text-xs"
              id="high-priority-count"
              aria-label={`${highPriorityTasks.length} high priority tasks`}
            >
              {highPriorityTasks.length}
            </Badge>
          </Button>
          <Button
            variant={mode === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("today")}
            className="relative"
            aria-pressed={mode === "today"}
            aria-describedby="due-today-count"
          >
            Due Today
            <Badge
              variant="secondary"
              className="ml-2 text-xs"
              id="due-today-count"
              aria-label={`${tasksDueToday.length} tasks due today`}
            >
              {tasksDueToday.length}
            </Badge>
          </Button>
        </div>

        <div className="flex gap-2 items-center flex-1 max-w-sm">
          <div className="relative flex-1">
            <label htmlFor="task-search" className="sr-only">
              Search tasks by title or description
            </label>
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="task-search"
              placeholder="Search tasks..."
              className="pl-10 pr-10"
              value={search}
              onChange={handleSearchChange}
              aria-describedby="search-help"
            />
            <div id="search-help" className="sr-only">
              Search through task titles and descriptions
            </div>
            {search && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={handleClearAllFilters} aria-label="Clear all filters">
              <X className="h-3 w-3 mr-1" aria-hidden="true" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active filters indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status" aria-live="polite">
          <span>Active filters:</span>
          <div className="flex gap-1 flex-wrap">
            {mode !== "all" && (
              <Badge variant="outline" className="text-xs">
                {mode === "high" ? "High Priority" : "Due Today"}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-3 w-3 ml-1 p-0"
                  onClick={() => handleFilterChange("all")}
                  aria-label={`Remove ${mode === "high" ? "high priority" : "due today"} filter`}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            {search && (
              <Badge variant="outline" className="text-xs">
                Search: "{search}"
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-3 w-3 ml-1 p-0"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
