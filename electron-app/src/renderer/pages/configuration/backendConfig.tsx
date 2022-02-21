import { Box } from '@mui/material'
import { observer } from 'mobx-react-lite'
import Editor from '@monaco-editor/react'

export default observer(function BackendConfig() {
  const sampleValue = `\
{
  "key": "value"
}
`

  return (
    <Box border="1px solid black">
      <Editor height="240px" defaultLanguage="json" defaultValue={sampleValue} theme="vs-dark" />
    </Box>
  )
})
