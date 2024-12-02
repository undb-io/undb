import { CONTEXT_TOKEN } from "@undb/context"
import { container } from "@undb/di"
import { createSqljsQueryBuilder, QUERY_BUILDER, TX_CTX } from "@undb/persistence/client"
import { DataServiceContext, DataServicetTxContext } from "./data-service.context"

export const registerDataService = async () => {
  container.register(TX_CTX, DataServicetTxContext)
  const qb = await createSqljsQueryBuilder()
  container.register(QUERY_BUILDER, { useValue: qb })
  container.register(CONTEXT_TOKEN, DataServiceContext)
}
