import type { IWorkspaceAction } from "./workspace-action"
import type { IWorkspaceMemberRole } from "./workspace-member"

export const workspacePermission: Record<IWorkspaceMemberRole, Record<IWorkspaceAction, boolean>> = {
  owner: {
    "table:create": true,
    "table:list": true,
    "table:delete": true,
    "table:read": true,
    "record:create": true,
    "record:list": true,
    "record:delete": true,
    "record:read": true,
    "record:update": true,
  },
  admin: {
    "table:create": true,
    "table:list": true,
    "table:delete": true,
    "table:read": true,
    "record:create": true,
    "record:list": true,
    "record:delete": true,
    "record:read": true,
    "record:update": true,
  },
  viewer: {
    "table:create": false,
    "table:list": true,
    "table:delete": false,
    "table:read": true,
    "record:create": false,
    "record:list": true,
    "record:delete": false,
    "record:read": true,
    "record:update": false,
  },
}
