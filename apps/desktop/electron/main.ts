import { app, BrowserWindow } from 'electron'
import { launchBackend } from './backend'
import { prepareEnv } from './env'
import { createWindow } from './window'

let win: BrowserWindow | null

app.on('window-all-closed', () => {
  win = null
})

app
  .whenReady()
  .then(prepareEnv)
  .then(launchBackend)
  .then(() => {
    win = createWindow()
  })
