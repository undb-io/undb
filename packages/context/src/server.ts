import { AsyncLocalStorage } from "node:async_hooks"
import type { ExecuteContext, IExecutionContext, SetContextValue } from "."

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
  return executionContext.getStore()?.user!.userId!
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
