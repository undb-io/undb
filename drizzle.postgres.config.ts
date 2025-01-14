import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./packages/persistence/src/schema/postgres.ts",
  out: "./apps/backend/drizzle/postgres",
  dialect: "postgresql",
  tablesFilter: ["undb_*"],
})
