import { z } from "@undb/zod"

export const workspaceActions = z.enum([
  //
  "table:create",
  "table:list",
  "table:delete",
])

export type IWorkspaceAction = z.infer<typeof workspaceActions>
