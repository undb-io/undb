import type { ContextMember, ContextUser, IContext, SetContextValue } from "@undb/context"
import { singleton } from "@undb/di"
import {
  injectQueryBuilder,
  type AnonymousTx,
  type IQueryBuilder,
  type ITxContext,
  type Tx,
} from "@undb/persistence/client"
import { DEFAULT_TEMP_SPACE_ID } from "@undb/space"

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
  setContextValue: SetContextValue = () => {}
  mustGetCurrentSpaceId(): string {
    return DEFAULT_TEMP_SPACE_ID
  }
  mustGetCurrentUser(): ContextUser {
    return {
      userId: "anonymous",
      username: "anonymous",
    }
  }
  mustGetCurrentUserId(): string {
    return "anonymous"
  }
  getCurrentUserId(): string | undefined {
    return "anonymous"
  }
  getCurrentMember(): ContextMember {
    return {
      role: "owner",
      spaceId: DEFAULT_TEMP_SPACE_ID,
    }
  }
  getCurrentRole(): string {
    return "owner"
  }
}
