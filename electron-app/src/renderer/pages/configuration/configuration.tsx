import * as React from 'react'
import {
  Box,
  Button,
  Container, Divider,
  FormControlLabel, FormControlLabelProps,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  styled,
  Typography, useRadioGroup,
} from '@mui/material'

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

function OnChangeTheme(event: React.SyntheticEvent, checked: boolean) {
  const elem = event.target as HTMLInputElement
  console.log(elem.value)
}

export default function Configuration() {
  return (
    <div style={{ width: '100%' }}>
      <Stack spacing={2} padding={3} paddingTop={7} sx={{ display: 'flex' }}>
        <Stack direction="row" justifyContent="end">
          <Typography variant="h3">Settings</Typography>
        </Stack>
        <Stack direction="column">
          <Typography variant="h6">Theme</Typography>
          <RadioGroup row aria-label="theme" defaultValue="system" name="theme-radio-groups">
            <FormControlLabel value="system" control={<Radio />} label="System" onChange={OnChangeTheme}/>
            <FormControlLabel value="light" control={<Radio />} label="Light" onChange={OnChangeTheme}/>
            <FormControlLabel value="dark" control={<Radio />} label="Dark" onChange={OnChangeTheme}/>
          </RadioGroup>
        </Stack>
        <Divider variant="middle" />
        <Stack direction="row">
          <Button variant="contained">Item 1</Button>
        </Stack>
        <Button variant="contained">Item 1</Button>
        <Button variant="contained">Item 2</Button>
        <Item>Item 3</Item>
        <Item>Item 4</Item>
      </Stack>
    </div>
  )
}
