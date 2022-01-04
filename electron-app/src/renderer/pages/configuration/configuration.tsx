import * as React from 'react'
import { FormControlLabel, Paper, Radio, RadioGroup, Stack, styled, Typography } from '@mui/material'
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
    <div style={{ width: '100%' }}>
      <Stack spacing={2} padding={3} paddingTop={7} sx={{ display: 'flex' }}>
        <Stack direction="row" justifyContent="end">
          <Typography variant="h3">Settings</Typography>
        </Stack>
        <Stack direction="column">
          <Typography variant="h6">Theme</Typography>
          <RadioGroup row aria-label="theme" defaultValue="system" name="theme-radio-groups" onChange={OnChangeTheme}>
            <FormControlLabel value="system" control={<Radio />} label="System" />
            <FormControlLabel value="light" control={<Radio />} label="Light" />
            <FormControlLabel value="dark" control={<Radio />} label="Dark" />
          </RadioGroup>
        </Stack>
        {/* <Divider variant="middle" /> */}
        {/* <Stack direction="row"> */}
        {/*  <Button variant="contained">Item 1</Button> */}
        {/* </Stack> */}
        {/* <Button variant="contained">Item 1</Button> */}
        {/* <Button variant="contained">Item 2</Button> */}
        {/* <Item>Item 3</Item> */}
        {/* <Item>Item 4</Item> */}
      </Stack>
    </div>
  )
}
