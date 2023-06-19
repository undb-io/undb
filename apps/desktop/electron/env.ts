import { app } from 'electron'
import path from 'node:path'

export const prepareEnv = async () => {
  process.env.DIST = path.join(__dirname, '../dist')
  process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

  process.env.UNDB_FRONTEND_OUT_DIR = path.join(__dirname, '../out/apps/frontend/build')
  process.env.APP_ENV = 'desktop'
}
