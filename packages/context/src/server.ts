import { AsyncLocalStorage } from "node:async_hooks"
import type { IExecutionContext } from "."
import type { ExecuteContext } from "./context.type"

export const executionContext = new AsyncLocalStorage<ExecuteContext>() satisfies IExecutionContext
