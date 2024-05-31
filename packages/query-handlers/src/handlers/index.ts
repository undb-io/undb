import { GetAggregatesQueryHandler } from "./get-aggregates.query-handler"
import { GetReadableRecordByIdHandler } from "./get-readable-record-by-id.query-handler"
import { GetReadableRecordsHandler } from "./get-readable-records.query-handler"
import { GetRecordByIdQueryHandler } from "./get-record-by-id.query-handler"
import { GetRecordsQueryHandler } from "./get-records.query-handler"
import { GetTableQueryHandler } from "./get-table.query-handler"
import { GetTablesQueryHandler } from "./get-tables.query-handler"
import { GetWebhooksQueryHandler } from "./get-webhooks.query-handler"

export const queryHandlers = [
  GetTablesQueryHandler,
  GetTableQueryHandler,
  GetRecordsQueryHandler,
  GetRecordByIdQueryHandler,
  GetReadableRecordsHandler,
  GetAggregatesQueryHandler,
  GetReadableRecordByIdHandler,
  GetWebhooksQueryHandler,
]
