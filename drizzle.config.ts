import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './packages/persistence/src/tables.ts',
  out: './apps/backend/drizzle',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './apps/backend/.undb/undb.db',
  },
})
