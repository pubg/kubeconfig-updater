import { Box, Button, Collapse, SpeedDial } from '@mui/material'
import { observer } from 'mobx-react-lite'
import Editor, * as monaco from '@monaco-editor/react'
import { useCallback, useState } from 'react'
import { useResolve } from '../../hooks/container'
import BackendConfigStore from '../../store/backendConfigStore'
import ThemeStore from '../../store/themeStore'
import { useReaction } from '../../hooks/mobx'

export default observer(function BackendConfig() {
  const store = useResolve(BackendConfigStore)

  const [value, setValue] = useState(store.value)
  const theme = useResolve(ThemeStore)
  const editorTheme = theme.theme === 'light' ? 'light' : 'vs-dark'

  useReaction(
    () => store.value,
    () => {
      setValue(store.value)
    }
  )

  const onTextChanged: monaco.OnChange = useCallback((v) => {
    setValue(v ?? '')
  }, [])

  const onSave = useCallback(() => {
    // TODO: implement this
  }, [])

  return (
    <Box display="flex" border="1px solid black" flexDirection="column" gap="8px">
      <Editor height="240px" defaultLanguage="json" defaultValue={value} theme={editorTheme} onChange={onTextChanged} />
      <Collapse in={value !== store.value}>
        <Box>
          <Button onClick={onSave} sx={{ float: 'right' }}>
            Save
          </Button>
        </Box>
      </Collapse>
    </Box>
  )
})
