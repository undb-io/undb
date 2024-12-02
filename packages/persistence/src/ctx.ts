import { inject, singleton } from "@undb/di"
import { AsyncLocalStorage } from "node:async_hooks"
import type { ITxContext } from "./ctx.interface"
import { injectQueryBuilder } from "./qb.provider"
import type { AnonymousTx, IQueryBuilder, Tx } from "./qb.type"

export interface TxContext {
  trx: Tx | AnonymousTx
}

export const CTX = Symbol("ctx")
export const injectContext = () => inject(CTX)

@singleton()
export class TxContextImpl implements ITxContext {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
    @injectContext()
    private readonly context: AsyncLocalStorage<TxContext>,
  ) {}

  withTransaction<T = any>(callback: () => Promise<T>): Promise<T> {
    return this.qb.transaction().execute(async (trx) => {
      return new Promise(async (resolve, reject) => {
        this.startTransaction(trx)
        try {
          const result = await callback()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  startTransaction(tx: any) {
    this.context.enterWith({ trx: tx })
  }

  getCurrentTransaction() {
    return (this.context.getStore()?.trx ?? this.qb) as Tx
  }

  getAnonymousTransaction() {
    return (this.context.getStore()?.trx ?? this.qb) as AnonymousTx
  }
}
