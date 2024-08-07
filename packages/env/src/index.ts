import { createEnv } from "@t3-oss/env-core"
import { z } from "@undb/zod"

const dbEnv = createEnv({
  server: {
    UNDB_DB_TURSO_URL: z.string().optional(),
    UNDB_DB_TURSO_AUTH_TOKEN: z.string().optional(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})

const oauthEnv = createEnv({
  server: {
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})

const minioEnv = createEnv({
  server: {
    UNDB_MINIO_STORAGE_ENDPOINT: z.string().optional(),
    UNDB_MINIO_STORAGE_PORT: z
      .string()
      .optional()
      .default("9000")
      .transform((v) => parseInt(v, 10)),
    UNDB_MINIO_STORAGE_USE_SSL: z
      .string()
      .optional()
      .default("false")
      .refine((v) => v === "true" || v === "false", {
        message: "UNDB_MINIO_STORAGE_USE_SSL must be a boolean",
      })
      .transform((v) => v === "true"),
    UNDB_MINIO_STORAGE_REGION: z.string().optional(),
    UNDB_MINIO_STORAGE_BUCKET: z.string().optional(),
    UNDB_MINIO_STORAGE_ACCESS_KEY: z.string().optional(),
    UNDB_MINIO_STORAGE_SECRET_KEY: z.string().optional(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})

export const env = createEnv({
  shared: {
    LOG_LEVEL: z.enum(["info", "debug", "error"]).default("info"),
  },
  clientPrefix: "UNDB_PUBLIC_",
  client: {},
  server: {
    UNDB_BASE_URL: z.string().optional(),
    UNDB_MAIL_HOST: z.string().optional(),
    UNDB_MAIL_PORT: z.string().optional(),
    UNDB_MAIL_DEFAULT_FROM: z.string().optional(),
    UNDB_VERIFY_EMAIL: z
      .string()
      .optional()
      .default("false")
      .refine((v) => v === "true" || v === "false", {
        message: "UNDB_VERIFY_EMAIL must be a boolean",
      })
      .transform((v) => v === "true"),

    UNDB_STORAGE_PROVIDER: z.enum(["local", "minio"]).default("local").optional(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
  extends: [dbEnv, oauthEnv, minioEnv],
})
