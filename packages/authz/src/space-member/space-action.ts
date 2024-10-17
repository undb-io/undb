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

  "dashboard:create",
  "dashboard:update",
  "dashboard:read",
  "dashboard:list",
  "dashboard:delete",

  "view:create",
  "view:update",
  "view:read",
  "view:list",
  "view:delete",

  "form:create",
  "form:update",
  "form:list",
  "form:delete",
  "form:read",

  "field:create",
  "field:update",
  "field:delete",

  "record:create",
  "record:list",
  "record:delete",
  "record:read",
  "record:update",
  "record:download",

  "webhook:create",
  "webhook:update",
  "webhook:delete",
  "webhook:list",

  "share:disable",
  "share:view",
  "share:table",
  "share:base",
  "share:form",
  "share:dashboard",

  "authz:invite",
  "authz:listInvitation",
  "authz:deleteInvitation",
])

export type ISpaceAction = z.infer<typeof spaceActions>
