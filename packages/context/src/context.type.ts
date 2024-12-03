import { inject } from "@undb/di"

export interface ContextUser {
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

export interface IContext {
  setContextValue: SetContextValue
  mustGetCurrentUser(): ContextUser
  mustGetCurrentSpaceId(): string
  mustGetCurrentUserId(): string
  getCurrentUserId(): string | undefined
  getCurrentMember(): ContextMember
  getCurrentRole(): string
}

export const CONTEXT_TOKEN = Symbol.for("context")

export const injectContext = () => inject(CONTEXT_TOKEN)
