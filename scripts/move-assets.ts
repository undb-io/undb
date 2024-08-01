import { $ } from "bun"
import { cp, exists, mkdir } from "node:fs/promises"

let extension = ""
if (process.platform === "win32") {
  extension = ".exe"
}

const rustInfo = await $`rustc -vV`.text()

const targetTriple = /host: (\S+)/g.exec(rustInfo)![1]

const file = Bun.file(`apps/backend/undb${extension}`)

await Bun.write(`apps/desktop/src-tauri/binaries/app${extension}`, file)
await Bun.write(`apps/desktop/src-tauri/binaries/app-${targetTriple}${extension}`, file)

await cp("apps/backend/drizzle", "apps/desktop/src-tauri/drizzle", { recursive: true })
await cp("apps/frontend/dist", "apps/desktop/src-tauri/dist", { recursive: true })

const dbFolder = "apps/desktop/src-tauri/.undb"
if (!(await exists(dbFolder))) {
  await mkdir(dbFolder)
}
await Bun.write(`${dbFolder}/README.md`, "# database")
