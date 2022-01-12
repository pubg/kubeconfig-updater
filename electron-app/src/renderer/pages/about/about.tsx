import * as React from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { Box, Paper, Stack } from '@mui/material'
import icon from '../../../../assets/icon.png'

export default function About() {
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Stack direction="column">
        <Box sx={{ m: 5 }} textAlign="center">
          <img src={icon} width="160" alt="alt" />
        </Box>
        <Box textAlign="center">
          <Typography variant="h4" component="div" gutterBottom>
            Kubeconfig-Updater
          </Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="body2" component="div" gutterBottom>
            Version {WebpackInjected.BUILD_VERSION}
          </Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="caption" component="div" gutterBottom>
            @2022 Krafton
          </Typography>
        </Box>
      </Stack>
    </Grid>
  )
}
