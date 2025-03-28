import { inject,singleton } from "@undb/di"
import { AsyncLocalStorage } from "node:async_hooks"
import type { ITxContext } from "./ctx.interface"
import { injectQueryBuilder } from "./qb.provider"
import type { AnonymousTx,IQueryBuilder,Tx } from "./qb.type"

export interface TxContext {
  trx: Tx | AnonymousTx
}

export const CTX = Symbol("ctx")
export const injectContext = () => inject(CTX)

@singleton()
export class TxContextImpl implements ITxContext {
  constructor(
    @injectContext()
    private readonly context: AsyncLocalStorage<TxContext>,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  withTransaction<T = any>(callback: () => Promise<T>): Promise<T> {
    return this.qb.transaction().execute(async (trx) => {
      let storeExisted = false
      const currentStore = this.context.getStore()
      if (currentStore?.trx) {
        storeExisted = true
        return callback()
      }

      // 创建新事务上下文
      this.startTransaction(trx);
      try {
        const result = await callback();
        return result;
      } catch (error) {
        throw error;
      }
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
