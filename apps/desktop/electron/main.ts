import { app, BrowserWindow } from 'electron'
import { launchBackend } from './backend'
import { prepareEnv } from './env'
import { createWindow } from './window'

let win: BrowserWindow | null
let backend: any

app
  .on('window-all-closed', async () => {
    if (process.platform !== 'darwin') {
      await backend.close()
      win = null
      app.quit()
    }
  })
  .on('activate', () => {
    if (win) win.show()
  })

app
  .whenReady()
  .then(prepareEnv)
  .then(async () => {
    backend = await launchBackend()
  })
  .then(() => {
    win = createWindow()
    win.on('close', (e) => {
      e.preventDefault()
      win?.hide()
    })
  })
