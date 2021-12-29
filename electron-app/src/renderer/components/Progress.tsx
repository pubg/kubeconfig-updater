/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  BoxProps,
  LinearProgress,
  LinearProgressProps,
  styled,
  SxProps,
  Typography,
  useTheme,
} from '@mui/material'
import { observer } from 'mobx-react-lite'

const StyledProgress = styled(LinearProgress)(({ theme }) => {
  return {
    width: '100%',
    height: '100%',
  }
})

export interface ProgressProps {
  title: string
  sx?: SxProps
  containerStyles?: BoxProps
  props?: LinearProgressProps
}

// TODO: fix progress bar square shape
export default observer(function Progress({ title, sx, props }: ProgressProps) {
  const theme = useTheme()

  return (
    <Box
      position="relative"
      width="256px"
      height="32px"
      zIndex={theme.zIndex.snackbar}
      overflow="hidden" // to apply border-radius
      sx={sx}
    >
      <Box
        top={0}
        right={0}
        bottom={0}
        left={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={1}
      >
        <Typography display="block">{title}</Typography>
      </Box>
      <StyledProgress {...props} />
    </Box>
  )
})
