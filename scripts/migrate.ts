import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import url from "node:url"

const { default: journal } = await import("../apps/backend/drizzle/sqlite/meta/_journal.json", {
  with: { type: "json" },
})

interface Migration {
  idx: number
  when: number
  tag: string
  hash: string
  sql: string[]
}

const migrate: Migration[] = []

const root = path.resolve(url.fileURLToPath(path.dirname(import.meta.url)), "..")
const outdir = path.resolve(root, "./apps/backend/migrations/")
const outfile = path.resolve(outdir, "deployment.json")

console.log()

for (let index = 0; index < journal.entries.length; index++) {
  const { when, idx, tag } = journal.entries[index]

  console.log('(%d) Parsing migration tagged "%s"', index + 1, tag)

  const filepath = path.resolve(root, "./apps/backend/drizzle/sqlite", `${tag}.sql`)
  const migration_file = fs.readFileSync(filepath).toString()

  migrate.push({
    idx,
    when,
    tag,
    hash: crypto.createHash("sha256").update(migration_file).digest("hex"),
    sql: migration_file
      .replace(/\n\t?/g, "")
      .split("--> statement-breakpoint")
      .map((x) => x.trim()),
  })
}

if (fs.existsSync(outdir) === false) fs.mkdirSync(outdir)

fs.writeFileSync(outfile, JSON.stringify(migrate, null, 2))

console.log()
console.log('Migration deployment config file written out to "%s"\n', outfile)
