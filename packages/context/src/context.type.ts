import type { ISpaceMemberRole } from "@undb/authz"

interface ContextUser {
  userId: string | null
  username?: string
  email?: string
}

export interface ContextMember {
  role: ISpaceMemberRole | null
}

export interface ExecuteContext {
  requestId: string
  user?: ContextUser
  member?: ContextMember
}
