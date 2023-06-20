import detectPort from 'detect-port'
import { app } from 'electron'
import isDev from 'electron-is-dev'
import path from 'node:path'

const prepareBackendPort = async () => {
  const port = await detectPort(4000)
  process.env.UNDB_BACKEND_PORT = port
}

export const prepareEnv = async () => {
  if (!isDev) {
    process.env.NODE_ENV = 'production'
  }

  process.env.DIST = path.join(__dirname, '../dist')
  process.env.DIST_ELECTRON = path.join(__dirname, '../dist-electron')

  process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

  process.env.UNDB_DATABASE_SQLITE_DATA = path.join(app.getPath('userData'), '.undb/data/undb.db')

  if (!isDev) {
    process.env.UNDB_FRONTEND_OUT_DIR = path.join(process.resourcesPath, '/out/apps/frontend/build')
  }
  process.env.APP_ENV = 'desktop'

  if (!isDev) {
    await prepareBackendPort()
  }
}
