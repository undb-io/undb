import { NestGetParentAvailableRecordsQueryHandelr } from './get-parent-available-records.query.handler'
import { NestGetRecordsQueryHandelr } from './get-records.query.handler'
import { NestGetTableQueryHandelr } from './get-table.query.handler'
import { NestGetTablesQueryHandelr } from './get-tables.query.handler'
import { NestGetTreeAvailableRecordsQueryHandelr } from './get-tree-available-records.query.handler'

export const queryHandlers = [
  NestGetTableQueryHandelr,
  NestGetTablesQueryHandelr,
  NestGetRecordsQueryHandelr,
  NestGetTreeAvailableRecordsQueryHandelr,
  NestGetParentAvailableRecordsQueryHandelr,
]
