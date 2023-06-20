import isDev from 'electron-is-dev'
import path from 'node:path'
import waitPort from 'wait-port'

export async function launchBackend() {
  if (isDev) {
    // frontend
    await waitPort({ port: 3000 })
    // backend
    await waitPort({ port: 4000 })
    return
  }

  const p = path.join(process.resourcesPath, '/out/apps/backend/dist/main.js')
  const backend = await import(p)
  return await backend.bootstrap()
}
