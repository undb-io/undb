import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./packages/persistence/src/tables.ts",
  out: "./apps/backend/drizzle",
  dialect: "sqlite",
  tablesFilter: ["undb_*"],
  dbCredentials: {
    url: "./apps/backend/.undb/undb.db",
  },
})
