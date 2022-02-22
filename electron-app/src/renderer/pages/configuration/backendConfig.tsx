import { Box, Button, Collapse } from '@mui/material'
import { observer } from 'mobx-react-lite'
import Editor, * as monaco from '@monaco-editor/react'
import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useResolve } from '../../hooks/container'
import ApplicationConfigStore from '../../store/applicationConfigStore'
import ThemeStore from '../../store/themeStore'
import { useReaction } from '../../hooks/mobx'
import SnackbarStore from '../../store/snackbarStore'

export default observer(function BackendConfig() {
  const store = useResolve(ApplicationConfigStore)
  const snackbarStore = useResolve(SnackbarStore)

  const [value, setValue] = useState(store.value)
  const theme = useResolve(ThemeStore)
  const editorTheme = theme.theme === 'light' ? 'light' : 'vs-dark'

  useEffect(() => {
    store.fetchConfig()
  }, [store])

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
    ;(async () => {
      if (store.state === 'ready') {
        await store.saveConfig(value)
        await store.fetchConfig()
        snackbarStore.push({
          key: dayjs().toString(),
          message: 'Application Config updated.',
          options: { variant: 'info', persist: false },
        })
      }
    })()
  }, [snackbarStore, store, value])

  return (
    <Box display="flex" border="1px solid black" flexDirection="column" gap="8px">
      <Editor height="480px" defaultLanguage="yaml" defaultValue={value} theme={editorTheme} onChange={onTextChanged} />
      <Collapse in={value !== store.value}>
        <Box>
          <Button size="large" onClick={onSave} sx={{ float: 'right' }}>
            Save
          </Button>
        </Box>
      </Collapse>
    </Box>
  )
})
