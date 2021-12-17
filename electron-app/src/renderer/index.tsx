// required by tsyringe
import 'reflect-metadata'

import { ThemeProvider } from '@mui/material'
import { initializeIcons } from '@fluentui/react/lib/Icons'
import { render } from 'react-dom'
import { createTheme } from '@mui/material/styles'
import App from './App'

const theme = createTheme({
  palette: {
    // mode: 'dark',
  },
})

initializeIcons()

// TODO: initialize grpc kubeconfigclient

render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
)
