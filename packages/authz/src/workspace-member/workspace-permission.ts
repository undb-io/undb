import type { IWorkspaceAction } from "./workspace-action"
import type { IWorkspaceMemberRole } from "./workspace-member"

export const workspacePermission: Record<IWorkspaceMemberRole, Record<IWorkspaceAction, boolean>> = {
  owner: {
    "table:create": true,
    "table:list": true,
    "table:delete": true,
  },
  admin: {
    "table:create": true,
    "table:list": true,
    "table:delete": true,
  },
  member: {
    "table:create": false,
    "table:list": true,
    "table:delete": false,
  },
}
