import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./packages/persistence/src/tables.ts",
  out: "./apps/backend/drizzle",
  dialect: "turso",
  tablesFilter: ["undb_*"],
  dbCredentials: {
    url: process.env.UNDB_DB_TURSO_URL!,
  },
})
