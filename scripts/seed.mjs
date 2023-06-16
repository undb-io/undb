import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'
import Database from 'better-sqlite3'

const cwd = process.cwd()
const dir = path.join(cwd, '.undb/data')

const exists = fs.existsSync(dir)
if (!exists) {
  fs.mkdirSync(dir, { recursive: true })

  const db = new Database(path.join(cwd, '.undb/data/undb.db'))

  const migration = fs.readFileSync('data/data.sql', 'utf8')

  db.exec(migration)

  console.log(chalk.green('Seed data successfully'))
} else {
  console.log(chalk.yellow('database exists skipping seed...'))
}
