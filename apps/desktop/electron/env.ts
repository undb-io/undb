import { app } from 'electron'
import path from 'node:path'

export const prepareEnv = async () => {
  process.env.DIST = path.join(__dirname, '../dist')
  process.env.DIST_ELECTRON = path.join(__dirname, '../dist-electron')

  process.env.RELEASE = path.join(__dirname, '../release')
  process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

  process.env.UNDB_DATABASE_SQLITE_DATA = '/Users/chenqinnee/.undb-test'

  process.env.UNDB_FRONTEND_OUT_DIR = path.join(process.resourcesPath, '/out/apps/frontend/build')
  process.env.APP_ENV = 'desktop'
}
