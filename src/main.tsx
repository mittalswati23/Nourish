import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/context/ThemeContext'
import { PrefsProvider } from '@/context/PrefsContext'
import App from '@/App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: Infinity,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PrefsProvider>
          <App />
        </PrefsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
