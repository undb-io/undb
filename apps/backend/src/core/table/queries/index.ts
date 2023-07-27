import { NestAggregateNumberQueryHandler } from './aggregate-number.query.handler.js'
import { NestGetChartDataQueryHandler } from './get-chart-data.query.handler.js'
import { NestGetForeignRecordsQueryHandler } from './get-foreign-records.query.handler.js'
import { NestGetParentAvailableRecordsQueryHandler } from './get-parent-available-records.query.handler.js'
import { NestGetRecordQueryHandler } from './get-record.query.handler.js'
import { NestGetRecordsTreeQueryHandler } from './get-records-tree.query.handler.js'
import { NestGetRecordsQueryHandler } from './get-records.query.handler.js'
import { NestGetTableQueryHandler } from './get-table.query.handler.js'
import { NestGetTablesQueryHandler } from './get-tables.query.handler.js'
import { NestGetTrashRecordsQueryHandler } from './get-trash-records.query.handler.js'
import { NestGetTreeAvailableRecordsQueryHandler } from './get-tree-available-records.query.handler.js'

export const queryHandlers = [
  NestGetTableQueryHandler,
  NestGetTablesQueryHandler,
  NestGetTrashRecordsQueryHandler,
  NestGetRecordQueryHandler,
  NestGetRecordsQueryHandler,
  NestGetForeignRecordsQueryHandler,
  NestGetRecordsTreeQueryHandler,
  NestGetTreeAvailableRecordsQueryHandler,
  NestGetParentAvailableRecordsQueryHandler,

  NestAggregateNumberQueryHandler,
  NestGetChartDataQueryHandler,
]
