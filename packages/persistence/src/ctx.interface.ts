import type { AnonymousTx, Tx } from "./qb.type"

export interface ITxContext {
  withTransaction: <T = any>(callback: () => Promise<T>) => Promise<T>
  startTransaction: (tx: any) => void
  getCurrentTransaction: () => Tx
  getAnonymousTransaction: () => AnonymousTx
}
