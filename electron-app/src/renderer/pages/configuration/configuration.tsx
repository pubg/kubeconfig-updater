import * as React from 'react'
import { Container, FormControlLabel, Paper, Radio, RadioGroup, Stack, styled, Typography } from '@mui/material'
import { useResolve } from '../../hooks/container'
import browserLogger from '../../logger/browserLogger'
import ThemeStore from '../../store/themeStore'
import { ThemeType } from '../../repositories/themeRepository'

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

export default function Configuration() {
  const themeStore = useResolve(ThemeStore)
  const OnChangeTheme = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    themeStore.setPreferredTheme(value as ThemeType)
  }

  return (
    <Container
      maxWidth="md"
      sx={{ pt: '64px', pb: '64px', height: '100%', display: 'flex', flexDirection: 'column', gap: '64px' }}
    >
      <Typography variant="h3">Settings</Typography>
      <Stack direction="column">
        <Typography variant="h6">Theme</Typography>
        <RadioGroup row aria-label="theme" defaultValue="system" name="theme-radio-groups" onChange={OnChangeTheme}>
          <FormControlLabel value="system" control={<Radio />} label="System" />
          <FormControlLabel value="light" control={<Radio />} label="Light" />
          <FormControlLabel value="dark" control={<Radio />} label="Dark" />
        </RadioGroup>
      </Stack>
    </Container>
  )
}
