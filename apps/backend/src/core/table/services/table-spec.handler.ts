import type { Provider } from '@nestjs/common'
import type { ITableRepository } from '@undb/core'
import { TableSpecHandler } from '@undb/core'
import { TABLE_REPOSITORY } from '../adapters/sqlite/table-sqlite.repository.js'

export const tableSpecHandler: Provider = {
  provide: TableSpecHandler,
  useFactory: (tableRepo: ITableRepository) => new TableSpecHandler(tableRepo),
  inject: [TABLE_REPOSITORY],
}
