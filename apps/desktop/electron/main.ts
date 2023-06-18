import { app, BrowserWindow } from 'electron'
import isDev from 'electron-is-dev'
import { spawn } from 'node:child_process'
import path from 'node:path'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null

async function launchBackend() {
  // if (isDev) return
  const backend = path.join(__dirname, '../../backend/dist/main.js')

  spawn('node', [backend])
}

function createWindow() {
  let x: number | undefined
  let y: number | undefined
  const currentWindow = BrowserWindow.getFocusedWindow()

  if (currentWindow) {
    const [currentWindowX, currentWindowY] = currentWindow.getPosition()
    x = currentWindowX + 24
    y = currentWindowY + 24
  }

  win = new BrowserWindow({
    x,
    y,
    width: 1800,
    height: 1000,
    icon: path.join(process.env.PUBLIC!, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      scrollBounce: true,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  isDev ? win.loadURL('http://localhost:4000') : win.loadURL('http://localhost:4000')
  // if (VITE_DEV_SERVER_URL) {
  //   win.loadURL(VITE_DEV_SERVER_URL)
  // } else {
  //   // win.loadFile('dist/index.html')
  //   win.loadFile(path.join(process.env.DIST!, 'index.html'))
  // }
}

app.on('window-all-closed', () => {
  win = null
})

app.whenReady().then(launchBackend).then(createWindow)
