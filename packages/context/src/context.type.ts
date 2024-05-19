interface ContextUser {
  userId: string | null
}

export interface ExecuteContext {
  requestId: string
  user?: ContextUser
}
