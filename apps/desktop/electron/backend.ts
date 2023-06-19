export async function launchBackend() {
  // if (isDev) return

  const backendPath = '../dist-electron/out/apps/backend/dist/main.js'
  const backend = await import(backendPath)
  await backend.bootstrap()
}
