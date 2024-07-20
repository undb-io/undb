import type { IWorkspaceMemberRole } from "@undb/authz"

interface ContextUser {
  userId: string | null
  username?: string
  email?: string
}

export interface ContextMember {
  role: IWorkspaceMemberRole | null
}

export interface ExecuteContext {
  requestId: string
  user?: ContextUser
  member?: ContextMember
}
