import { DetailsList } from '@fluentui/react'
import { Box, Container, Paper } from '@mui/material'
import { generateMockClusterInfos } from '../../../shared/models/clusterInfo/mockClusterInfo'

const items = generateMockClusterInfos(64)

export default function ClusterManagement() {
  return (
    /** background */
    <Paper sx={{ width: '100%', height: '100%' }}>
      {/* actual container */}
      <Container sx={{ width: '100%', height: '100%' }}>
        {/* Header Menu Container */}
        <Paper>
          <p>Hello!</p>
        </Paper>

        {/* list container */}
        <Box overflow="scroll" height="100%">
          <DetailsList items={items} />
        </Box>
      </Container>
    </Paper>
  )
}
