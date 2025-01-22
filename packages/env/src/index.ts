import { createEnv } from "@t3-oss/env-core"
import { z } from "@undb/zod"

const authEnv = createEnv({
  server: {
    UNDB_DISABLE_REGISTRATION: z
      .string()
      .optional()
      .default("false")
      .refine((v) => v === "true" || v === "false", {
        message: "UNDB_DISABLE_REGISTRATION must be a boolean",
      })
      .transform((v) => v === "true"),
    UNDB_ADMIN_EMAIL: z.string().email().optional(),
    UNDB_ADMIN_PASSWORD: z.string().optional(),
    UNDB_OTP_SECRET: z.string().optional(),
    UNDB_AUTH_OTP_ENABLED: z
      .string()
      .optional()
      .default("false")
      .refine((v) => v === "true" || v === "false", {
        message: "UNDB_AUTH_OTP_ENABLED must be a boolean",
      })
      .transform((v) => v === "true"),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})

const tursoEnv = createEnv({
  server: {
    UNDB_DB_TURSO_URL: z.string().optional(),
    UNDB_DB_TURSO_AUTH_TOKEN: z.string().optional(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})

const postgresEnv = createEnv({
  server: {
    UNDB_DB_POSTGRES_URL: z.string().optional(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})

const mysqlEnv = createEnv({
  server: {
    UNDB_DB_MYSQL_URL: z.string().optional(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})

const oauthEnv = createEnv({
  server: {
    UNDB_OAUTH_GITHUB_ENABLED: z
      .string()
      .optional()
      .default("false")
      .refine((v) => v === "true" || v === "false", {
        message: "UNDB_OAUTH_GITHUB_ENABLED must be a boolean",
      })
      .transform((v) => v === "true"),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    UNDB_OAUTH_GOOGLE_ENABLED: z
      .string()
      .optional()
      .default("false")
      .refine((v) => v === "true" || v === "false", {
        message: "UNDB_OAUTH_GOOGLE_ENABLED must be a boolean",
      })
      .transform((v) => v === "true"),
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
      .transform((v) => (v ? parseInt(v, 10) : undefined)),
    UNDB_MINIO_STORAGE_USE_SSL: z
      .string()
      .optional()
      .default("false")
      .refine((v) => v === "true" || v === "false", {
        message: "UNDB_MINIO_STORAGE_USE_SSL must be a boolean",
      })
      .transform((v) => v === "true"),
    UNDB_MINIO_STORAGE_REGION: z.string().optional(),
    UNDB_MINIO_STORAGE_ACCESS_KEY: z.string().optional(),
    UNDB_MINIO_STORAGE_SECRET_KEY: z.string().optional(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})

const s3Env = createEnv({
  server: {
    UNDB_S3_ACCESS_KEY_ID: z.string().optional(),
    UNDB_S3_SECRET_ACCESS_KEY: z.string().optional(),
    UNDB_S3_STORAGE_ENDPOINT: z.string().url().optional(),
    UNDB_S3_STORAGE_REGION: z.string().optional(),
    UNDB_MAIL_USER: z.string().optional(),
    UNDB_MAIL_PASS: z.string().optional(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})

const storageEnv = createEnv({
  server: {
    UNDB_STORAGE_PROVIDER: z.enum(["local", "minio", "s3"]).default("local").optional(),
    UNDB_STORAGE_PRIVATE_BUCKET: z.string().optional().default("undb-private"),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})

const emailEnv = createEnv({
  server: {
    UNDB_MAIL_PROVIDER: z.enum(["nodemailer", "mailgun"]).default("nodemailer").optional(),
    UNDB_MAIL_HOST: z.string().optional(),
    UNDB_MAIL_PORT: z.string().optional(),
    UNDB_MAIL_DEFAULT_FROM: z.string().optional(),
    UNDB_MOCK_MAIL_CODE: z.string().optional(),
    UNDB_MAIL_SECURE: z
      .string()
      .optional()
      .default("false")
      .refine((v) => v === "true" || v === "false", {
        message: "UNDB_MAIL_SECURE must be a boolean",
      })
      .transform((v) => v === "true"),
    UNDB_VERIFY_EMAIL: z
      .string()
      .optional()
      .default("false")
      .refine((v) => v === "true" || v === "false", {
        message: "UNDB_VERIFY_EMAIL must be a boolean",
      })
      .transform((v) => v === "true"),
    UNDB_MAILGUN_API_KEY: z.string().optional(),
    UNDB_MAILGUN_DOMAIN: z.string().optional(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})

const dbEnv = createEnv({
  server: {
    UNDB_DB_PROVIDER: z.enum(["sqlite", "turso", "postgres", "mysql"]).default("sqlite").optional(),
    UNDB_OUTBOX_SCAN_BATCH_SIZE: z
      .string()
      .optional()
      .transform((v) => parseInt(v ?? "1000", 10)),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})

export const env = createEnv({
  shared: {
    LOG_LEVEL: z.enum(["info", "debug", "error"]).default("info"),
    UNDB_BASE_URL: z.string().optional().default("http://localhost:3721"),
  },
  clientPrefix: "UNDB_PUBLIC_",
  client: {},
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    UNDB_COOKIE_DOMAIN: z.string().optional(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
  extends: [tursoEnv, postgresEnv, mysqlEnv, dbEnv, oauthEnv, storageEnv, s3Env, emailEnv, minioEnv, authEnv],
})
