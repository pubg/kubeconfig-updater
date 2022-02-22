import * as React from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useResolve } from '../../hooks/container'
import ThemeStore from '../../store/themeStore'
import { ThemeType } from '../../repositories/themeRepository'
import BackendConfig from './backendConfig'

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: 'center',
  color: theme.palette.text.secondary,
  ':hover': {
    backgroundColor: theme.palette.action.selected,
  },
}))

export default function Page() {
  const themeStore = useResolve(ThemeStore)
  const OnChangeTheme = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    themeStore.setPreferredTheme(value as ThemeType)
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        pt: '64px',
        pb: '64px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '64px',
      }}
    >
      <Typography variant="h3">Settings</Typography>
      <Stack
        direction="column"
        sx={{
          overflow: 'hidden',
          overflowY: 'scroll',
        }}
      >
        <Item>
          <Typography variant="h6">Theme</Typography>
          <RadioGroup row aria-label="theme" defaultValue="system" name="theme-radio-groups" onChange={OnChangeTheme}>
            <FormControlLabel value="system" control={<Radio />} label="System" />
            <FormControlLabel value="light" control={<Radio />} label="Light" />
            <FormControlLabel value="dark" control={<Radio />} label="Dark" />
          </RadioGroup>
        </Item>

        <Item>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Application Config</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <BackendConfig />
            </AccordionDetails>
          </Accordion>
          <Box mt="8px" />
        </Item>

        <Item>
          <Box>
            <Typography variant="h6" sx={{ mb: '8px' }}>
              Directories
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1">Application Config</Typography>
              <Button onClick={globalThis.openLogDir}>Open</Button>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1">Logs</Typography>
              <Button onClick={globalThis.openBackendConfigDir}>Open</Button>
            </Box>
          </Box>
        </Item>
      </Stack>
    </Container>
  )
}
