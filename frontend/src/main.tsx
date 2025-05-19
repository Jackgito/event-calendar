import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from './context/SnackbarContext'
import { AuthenticationProvider } from "./context/AuthenticationContext"
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme'
import './globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <AuthenticationProvider>
          <CssBaseline />
          <App />
        </AuthenticationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
