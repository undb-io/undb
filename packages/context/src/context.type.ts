interface ContextUser {
  userId: string
}

export interface ExecuteContext {
  requestId: string
  user?: ContextUser
}
