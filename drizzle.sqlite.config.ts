import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./packages/persistence/src/schema/sqlite.ts",
  out: "./apps/backend/drizzle/sqlite",
  dialect: "sqlite",
  tablesFilter: ["undb_*"],
  dbCredentials: {
    url: "./apps/backend/undb.sqlite",
  },
})
