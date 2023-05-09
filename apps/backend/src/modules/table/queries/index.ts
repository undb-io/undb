import { NestAggregateNumberQueryHandelr } from './aggregate-number.query.handler copy.js'
import { NestGetForeignRecordsQueryHandelr } from './get-foreign-records.query.handler.js'
import { NestGetParentAvailableRecordsQueryHandelr } from './get-parent-available-records.query.handler.js'
import { NestGetRecordQueryHandelr } from './get-record.query.handler.js'
import { NestGetRecordsTreeQueryHandelr } from './get-records-tree.query.handler.js'
import { NestGetRecordsQueryHandelr } from './get-records.query.handler.js'
import { NestGetTableQueryHandelr } from './get-table.query.handler.js'
import { NestGetTablesQueryHandelr } from './get-tables.query.handler.js'
import { NestGetTreeAvailableRecordsQueryHandelr } from './get-tree-available-records.query.handler.js'

export const queryHandlers = [
  NestGetTableQueryHandelr,
  NestGetTablesQueryHandelr,
  NestGetRecordQueryHandelr,
  NestGetRecordsQueryHandelr,
  NestGetForeignRecordsQueryHandelr,
  NestGetRecordsTreeQueryHandelr,
  NestGetTreeAvailableRecordsQueryHandelr,
  NestGetParentAvailableRecordsQueryHandelr,

  NestAggregateNumberQueryHandelr,
]
