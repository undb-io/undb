#!/usr/bin/env zx

if (process.env.UNDB_LITESTREAM_REPLICA_URL) {
  const database = path.join(process.env.UNDB_DATABASE_SQLITE_DATA, `undb.db`)
  const exists = fs.pathExistsSync(database)
  if (exists) {
    console.log('Database already exists, skipping restore')
  } else {
    console.log('No database found, restoring from replica if exists')
    await $`litestream restore -v -if-replica-exists -o ${database} "${process.env.UNDB_LITESTREAM_REPLICA_URL}"`
  }

  await $`litestream replicate -exec "node apps/backend/dist/main.js"`
} else {
  await $`node apps/backend/dist/main.js`
}
