#!/usr/bin/env zx
import 'zx/globals'
import Database from 'better-sqlite3'
import { rimraf } from 'rimraf'

const cwd = process.cwd()
const dir = path.join(cwd, '.undb/data')

const exists = fs.existsSync(dir)
const exec = async () => {
  fs.mkdirSync(dir, { recursive: true })

  const db = new Database(path.join(cwd, '.undb/data/undb.db'))

  const migration = fs.readFileSync('data/data.sql', 'utf8')

  db.exec(migration)

  console.log(chalk.green('Seed data successfully'))
}
if (!exists) {
  await exec()
} else {
  let remove = await question('database exists, remove? (y/N)')
  remove = remove || 'n'
  remove = remove.toUpperCase()
  if (remove === 'Y') {
    await rimraf(dir)
    await exec()
  } else {
    console.log(chalk.yellow('database exists skipping seed...'))
  }
}
