import type { IGetTablesOutput, IGetTablesQuery } from '@egodb/core'
import type { AppRouter } from '@egodb/trpc'
import type { createTRPCProxyClient } from '@trpc/client'
import { boundClass } from 'autobind-decorator'

export interface ITableService {
  getTables(params: IGetTablesQuery): Promise<IGetTablesOutput>
}

@boundClass
export class TableApi implements ITableService {
  constructor(private readonly trpc: ReturnType<typeof createTRPCProxyClient<AppRouter>>) {}

  getTables(params: IGetTablesQuery): Promise<IGetTablesOutput> {
    return this.trpc.table.list.query(params)
  }
}
