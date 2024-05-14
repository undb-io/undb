import { AsyncLocalStorage } from "node:async_hooks"
import type { ExecuteContext } from "./context.type"
import type { IExecutionContext } from "."

export const executionContext = new AsyncLocalStorage<ExecuteContext>() satisfies IExecutionContext
