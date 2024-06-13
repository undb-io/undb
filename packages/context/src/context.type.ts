import type { IWorkspaceMemberRole } from "@undb/authz"

interface ContextUser {
  userId: string | null
}

export interface ContextMember {
  role: IWorkspaceMemberRole | null
}

export interface ExecuteContext {
  requestId: string
  user?: ContextUser
  member?: ContextMember
}
