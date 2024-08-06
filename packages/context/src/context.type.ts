interface ContextUser {
  userId: string | null
  username?: string
  email?: string
  emailVerified?: boolean
  avatar?: string
}

export interface ContextMember {
  role: any | null
  spaceId: string | null
}

export interface ExecuteContext {
  requestId: string
  user?: ContextUser
  member?: ContextMember
  spaceId?: string
}

export type SetContextValue = (key: keyof ExecuteContext, value: any) => void
