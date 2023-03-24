export interface IBaseRepository {
  begin(): Promise<void>
  commit(): Promise<void>
  rollback(): Promise<void>
}
