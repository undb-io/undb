import { z } from "@undb/zod"

export const workspaceActions = z.enum([
  //
  "table:create",
  "table:read",
  "table:list",
  "table:delete",

  "record:create",
  "record:list",
  "record:delete",
  "record:read",
  "record:update",
])

export type IWorkspaceAction = z.infer<typeof workspaceActions>
