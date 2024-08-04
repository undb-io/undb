import { AsyncLocalStorage } from "node:async_hooks"
import type { IExecutionContext } from "."
import type { ExecuteContext } from "./context.type"

export const executionContext = new AsyncLocalStorage<ExecuteContext>() satisfies IExecutionContext

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
