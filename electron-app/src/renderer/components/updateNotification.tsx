import { SnackbarKey, useSnackbar } from 'notistack'
import semver from 'semver'
import axios from 'axios'
import { useEffect } from 'react'
import { Box, Button } from '@mui/material'
import browserLogger from '../logger/browserLogger'
import { version } from '../../../package.json'

declare global {
  interface Window {
    openURL(url: string): void
  }
}

const API_URL = 'https://api.github.com/repos/pubg/kubeconfig-updater/releases/latest'
const LATEST_PAGE_URL = 'https://github.com/pubg/kubeconfig-updater/releases/latest'

interface NotificationHistory {
  latestVersion: string
}

const notificationHistoryLocalStorageKey = 'notification'

function canNotifyUpdate(latestVersion: semver.SemVer): boolean {
  const raw = localStorage.getItem(notificationHistoryLocalStorageKey)
  if (!raw) {
    return true
  }

  try {
    const data: NotificationHistory = JSON.parse(raw)

    return data.latestVersion !== latestVersion.format()
  } catch (err) {
    browserLogger.error(err)
    return false
  }
}

function saveCurrentVersionNotificated(latestVersion: semver.SemVer) {
  const data: NotificationHistory = { latestVersion: latestVersion.format() }
  const raw = JSON.stringify(data)

  localStorage.setItem(notificationHistoryLocalStorageKey, raw)
}

async function getLatestVersion(): Promise<semver.SemVer | null> {
  try {
    const { data } = await axios.get(API_URL)

    let parsedSemver = semver.parse(data.tag_name, true)
    if (parsedSemver === null) {
      parsedSemver = semver.parse(data.name)
    }

    return parsedSemver
  } catch (err) {
    browserLogger.error(err)
    return null
  }
}

export default function UpdateNotification() {
  const snackbar = useSnackbar()

  useEffect(() => {
    ;(async () => {
      const latestVersion = await getLatestVersion()
      if (!latestVersion) {
        browserLogger.warn('cannot get latest version from github')
        return
      }

      browserLogger.info(`latest version: ${latestVersion.format()}`)

      const currentVersion = semver.parse(version, true)
      if (!currentVersion) {
        throw new Error(`current version must be parsed as semver, value: ${semver}`)
      }

      browserLogger.info(`current version: ${currentVersion.format()}`)

      if (!canNotifyUpdate(latestVersion)) {
        browserLogger.debug(`skip notifying update (it's not first run), version: ${latestVersion.format()}`)
        return
      }

      let updateNotiSnackbarKey: SnackbarKey | null = null

      const onOpenReleaseWebpage = () => {
        window.openURL(LATEST_PAGE_URL)
      }

      const onSkip = () => {
        if (updateNotiSnackbarKey) {
          snackbar.closeSnackbar(updateNotiSnackbarKey)
        }

        saveCurrentVersionNotificated(latestVersion)
      }

      if (latestVersion.compare(currentVersion) > 0) {
        updateNotiSnackbarKey = snackbar.enqueueSnackbar(`new version ${latestVersion.format()} released`, {
          variant: 'info',
          action: (
            <Box display="flex">
              <Button variant="text" sx={{ color: 'white' }} onClick={onOpenReleaseWebpage}>
                Open
              </Button>
              <Button variant="text" sx={{ color: 'white' }} onClick={onSkip}>
                Skip
              </Button>
            </Box>
          ),
          persist: true,
        })
      }
    })()
  }, [snackbar])

  return <></>
}
