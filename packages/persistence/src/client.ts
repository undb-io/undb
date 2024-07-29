import { createClient } from "@libsql/client"
import { env } from "@undb/env"

export const sqlite = createClient({
  url: env.UNDB_DB_TURSO_URL!,
})
