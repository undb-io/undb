import { singleton } from "@undb/di"
import { AsyncLocalStorage } from "node:async_hooks"
import type { ContextMember, ContextUser, ExecuteContext, IContext, IExecutionContext, SetContextValue } from "."

export const executionContext = new AsyncLocalStorage() satisfies IExecutionContext

export const setContextValue: SetContextValue = (key: keyof ExecuteContext, value: any): void => {
  const store = executionContext.getStore()
  if (store) {
    ;(store as any)[key] = value
  }
}

export const getCurrentUser = () => {
  return executionContext.getStore()?.user!
}

export const getCurrentUserId = () => {
  return executionContext.getStore()?.user?.userId!
}

export const getCurrentMember = () => {
  return executionContext.getStore()?.member!
}

export const getCurrentRole = () => {
  return getCurrentMember().role!
}

export const getCurrentSpaceId = () => {
  return executionContext.getStore()?.spaceId
}

export const mustGetCurrentSpaceId = () => {
  const spaceId = getCurrentSpaceId()
  if (!spaceId) {
    throw new Error("SpaceId is required")
  }

  return spaceId
}

@singleton()
export class ServerContext implements IContext {
  setContextValue: SetContextValue = setContextValue
  mustGetCurrentUser(): ContextUser {
    return getCurrentUser()
  }
  mustGetCurrentSpaceId(): string {
    return mustGetCurrentSpaceId()
  }
  mustGetCurrentUserId(): string {
    return getCurrentUserId()
  }
  getCurrentUserId(): string | undefined {
    return getCurrentUserId()
  }
  getCurrentMember(): ContextMember {
    return getCurrentMember()
  }
  getCurrentRole(): string {
    return getCurrentRole()
  }
}
