import React from 'react'
import Router from './router'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';
const theme = createTheme({
  palette: {
    primary: {
      main: green[500],
      light: green[400],
      dark: green[600],
      contrastText: '#eee'
    }
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  )
}

export default App
