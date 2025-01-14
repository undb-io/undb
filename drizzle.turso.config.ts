import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./packages/persistence/src/schema/sqlite.ts",
  out: "./apps/backend/drizzle/sqlite",
  dialect: "turso",
  tablesFilter: ["undb_*"],
  dbCredentials: {
    url: process.env.UNDB_DB_TURSO_URL!,
  },
})
