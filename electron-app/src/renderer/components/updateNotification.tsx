import { useSnackbar } from 'notistack'
import semver from 'semver'
import axios from 'axios'
import { useEffect } from 'react'
import { Button } from '@mui/material'
import browserLogger from '../logger/browserLogger'
import { version } from '../../../package.json'

async function getLatestVersion(): Promise<semver.SemVer | null> {
  const URL = 'https://api.github.com/repos/pubg/kubeconfig-updater/releases/latest'
  try {
    const { data } = await axios.get(URL)

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

      if (latestVersion.compare(currentVersion) > 0) {
        snackbar.enqueueSnackbar(`new version ${latestVersion.format()} released`, {
          variant: 'info',
          action: (
            <Button variant="text" sx={{ color: 'white' }}>
              Open Release
            </Button>
          ),
        })
      }
    })()
  }, [snackbar])

  return <></>
}
