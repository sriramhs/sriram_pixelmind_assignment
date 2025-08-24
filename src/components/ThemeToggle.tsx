import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setTheme } from "@/redux/slices/preferencesSlice"
import { Moon, Sun } from "lucide-react"
import { useEffect } from "react"

export function ThemeToggle() {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.preferences.theme)

  useEffect(() => {
    const applyTheme = (themeMode: "light" | "dark" | "system") => {
      const root = document.documentElement

      if (themeMode === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        root.classList.toggle("dark", systemTheme === "dark")
      } else {
        root.classList.toggle("dark", themeMode === "dark")
      }
    }

    applyTheme(theme)

  
  }, [theme])

  const handleThemeChange = (newTheme: "light" | "dark" ) => {
    dispatch(setTheme(newTheme))
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      default:
        return <Moon className="h-4 w-4" />
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Light"
      case "dark":
        return "Dark"
      default:
        return "Dark"
    }
  }

  return (
   
        <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={() => theme === "dark" ? handleThemeChange("light") : handleThemeChange("dark")}>
          {getThemeIcon()}
          <span className="hidden sm:inline">{getThemeLabel()}</span>
          <span className="sr-only">Toggle theme</span>
        </Button>
 
  )
}
