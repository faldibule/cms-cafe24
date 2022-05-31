import React from 'react'
import Router from './router'
import { createTheme, ThemeProvider } from '@mui/material/styles';
const theme = createTheme()

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  )
}

export default App
