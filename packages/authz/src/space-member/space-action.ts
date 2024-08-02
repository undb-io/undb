import { z } from "@undb/zod"

export const spaceActions = z.enum([
  "space:list",
  "space:read",
  "space:update",
  "space:delete",

  "base:create",
  "base:list",
  "base:delete",
  "base:read",
  "base:update",

  "table:create",
  "table:update",
  "table:read",
  "table:list",
  "table:delete",

  "record:create",
  "record:list",
  "record:delete",
  "record:read",
  "record:update",

  "share:enable",
  "share:disable",

  "authz:invite",
  "authz:listInvitation",
  "authz:deleteInvitation",
])

export type ISpaceAction = z.infer<typeof spaceActions>
