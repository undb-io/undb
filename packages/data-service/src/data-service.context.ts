import type { IContext } from "@undb/context"
import { singleton } from "@undb/di"
import {
  injectQueryBuilder,
  type AnonymousTx,
  type IQueryBuilder,
  type ITxContext,
  type Tx,
} from "@undb/persistence/client"

@singleton()
export class DataServicetTxContext implements ITxContext {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  withTransaction<T = any>(callback: () => Promise<T>): Promise<T> {
    throw new Error("Method not implemented.")
  }

  startTransaction(tx: any) {}

  getCurrentTransaction() {
    return this.qb as Tx
  }

  getAnonymousTransaction() {
    return this.qb as unknown as AnonymousTx
  }
}

@singleton()
export class DataServiceContext implements IContext {
  mustGetCurrentSpaceId(): string {
    return "space1"
  }
  mustGetCurrentUserId(): string {
    return "anonymous"
  }
  getCurrentUserId(): string | undefined {
    return "anonymous"
  }
}
