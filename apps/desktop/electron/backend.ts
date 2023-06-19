import path from 'node:path'

export async function launchBackend() {
  // if (isDev) return

  const h = path.join(process.resourcesPath, '/out/apps/backend/dist/main.js')
  const backend = await import(h)
  await backend.bootstrap()
}
