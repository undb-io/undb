export interface IUnitOfWork<T = any> {
  begin(): Promise<void>
  commit(): Promise<void>
  rollback(): Promise<void>
  conn(): T
  close(): Promise<void>
}
