import { ITableRepository, TableSpecHandler } from '@egodb/core'
import { Provider } from '@nestjs/common'
import { TABLE_REPOSITORY } from '../adapters/index.js'

export const tableSpecHandler: Provider = {
  provide: TableSpecHandler,
  useFactory: (tableRepo: ITableRepository) => new TableSpecHandler(tableRepo),
  inject: [TABLE_REPOSITORY],
}
