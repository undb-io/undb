import { createEnv } from "@t3-oss/env-core"
import { z } from "@undb/zod"

export const env = createEnv({
  shared: {
    LOG_LEVEL: z.enum(["info", "debug", "error"]).default("info"),
  },
  clientPrefix: "UNDB_PUBLIC_",
  client: {},
  server: {
    UNDB_BASE_URL: z.string(),
    UNDB_MAIL_HOST: z.string(),
    UNDB_MAIL_PORT: z.string(),
    UNDB_MAIL_DEFAULT_FROM: z.string(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})
