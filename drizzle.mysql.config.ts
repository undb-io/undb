import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./packages/persistence/src/schema/mysql.ts",
  out: "./apps/backend/drizzle/mysql",
  dialect: "mysql",
  tablesFilter: ["undb_*"],
})
