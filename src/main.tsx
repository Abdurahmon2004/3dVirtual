import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>

      <App />
      </LocalizationProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
