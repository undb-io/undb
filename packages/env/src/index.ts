import { createEnv } from "@t3-oss/env-core"
import { z } from "@undb/zod"

export const env = createEnv({
  shared: {
    LOG_LEVEL: z.enum(["info", "debug", "error"]).default("info"),
  },
  clientPrefix: "UNDB_",
  client: {
    // UNDB_LOG_LEVEL: z.enum(["info", "debug", "error"]),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})
