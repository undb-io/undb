import { AsyncLocalStorage } from "node:async_hooks"
import type { AnonymousTx, Tx } from "./qb"

export interface TxContext {
  trx: Tx | AnonymousTx
}

export const txContext = new AsyncLocalStorage<TxContext>()

export function startTransaction(tx: any) {
  txContext.enterWith({ trx: tx })
}

export function getCurrentTransaction() {
  return txContext.getStore()?.trx as Tx
}

export function getAnonymousTransaction() {
  return txContext.getStore()?.trx as AnonymousTx
}
