import { useAppSelector } from "@/redux/hooks"
import type React from "react"

import { useEffect } from "react"


interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useAppSelector((state) => state.preferences.theme)

  useEffect(() => {
    const applyTheme = (themeMode: "light" | "dark" ) => {
      const root = document.documentElement

    
        root.classList.toggle("dark", themeMode === "dark")
      
    }

    applyTheme(theme)

   
  }, [theme])

  return <>{children}</>
}
