import { inject } from "@undb/di"
import type { ExecuteContext } from "./context.type"

export * from "./context.type"

export const CONTEXT_TOKEN = Symbol.for("context")

export const injectContext = () => inject(CONTEXT_TOKEN)

export interface IExecutionContext {
  getStore(): ExecuteContext | undefined
}
