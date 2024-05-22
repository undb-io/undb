import { GetRecordByIdQueryHandler } from "./get-record-by-id.query-handler"
import { GetRecordsQueryHandler } from "./get-records.query-handler"
import { GetTableQueryHandler } from "./get-table.query-handler"
import { GetTablesQueryHandler } from "./get-tables.query-handler"

export const queryHandlers = [
  GetTablesQueryHandler,
  GetTableQueryHandler,
  GetRecordsQueryHandler,
  GetRecordByIdQueryHandler,
]
