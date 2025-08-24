import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/ThemeProvider.tsx'
import { Provider } from "react-redux"
import { store } from './redux/store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
     <ThemeProvider>
    <App />
    </ThemeProvider>
    </Provider>
  </StrictMode>,
)
