import { ThemeProvider } from '@mui/material'
import { render } from 'react-dom'
import { createTheme } from '@mui/material/styles'
import App from './App'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
)
