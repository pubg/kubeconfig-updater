import { DetailsList, DetailsListLayoutMode } from '@fluentui/react'
import { Refresh } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Paper,
  Stack,
  Switch,
  TextField,
} from '@mui/material'
import { generateMockClusterInfos } from '../../../shared/models/clusterInfo/mockClusterInfo'

const mockTags = ['stage', 'vendor', 'region']

const items = generateMockClusterInfos(64)

export default function ClusterManagement() {
  return (
    /** background */
    <Paper sx={{ width: '100%', height: '100%' }}>
      {/* actual container */}
      <Container
        maxWidth="xl"
        sx={{ width: '100%', height: '100%', marginTop: '32px' }}
      >
        {/* Header Menu Container */}
        <Box sx={{ display: 'flex', marginBottom: '16px' }}>
          {/*  */}
          <Box />
          <Stack direction="row" width="100%" justifyContent="space-between">
            <FormGroup row sx={{ gap: '16px', alignItems: 'center' }}>
              <TextField
                size="small"
                id="outlined-basic"
                label="filter by name"
                variant="outlined"
              />
              <FormControlLabel control={<Switch />} label="Show Registered" />
              <Autocomplete
                multiple
                options={mockTags}
                disableCloseOnSelect
                getOptionLabel={(opt) => opt}
                style={{ width: '512px' }}
                size="small"
                renderInput={(params) => (
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  <TextField {...params} label="Group with Tag" />
                )}
                renderOption={(props, option, { selected }) => (
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  <li {...props}>
                    <Checkbox checked={selected} />
                    {option}
                  </li>
                )}
              />
            </FormGroup>
            <Stack direction="row">
              <Button variant="outlined" startIcon={<Refresh />}>
                Reload
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* list container */}
        <Box overflow="scroll" width="100%" height="100%">
          <DetailsList
            items={items}
            layoutMode={DetailsListLayoutMode.justified}
          />
        </Box>
      </Container>
    </Paper>
  )
}
