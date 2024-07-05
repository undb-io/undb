import { GetAggregatesQueryHandler } from "./get-aggregates.query-handler"
import { GetBaseQueryHandler } from "./get-base.query-handler"
import { GetBasesQueryHandler } from "./get-bases.query-handler"
import { GetMemberByIdQueryHandler } from "./get-member-by-id.query-handler"
import { GetMembersQueryHandler } from "./get-members.query-handler"
import { GetReadableRecordByIdHandler } from "./get-readable-record-by-id.query-handler"
import { GetReadableRecordsHandler } from "./get-readable-records.query-handler"
import { GetRecordAuditsQueryHandler } from "./get-record-audits.query-handler"
import { GetRecordByIdQueryHandler } from "./get-record-by-id.query-handler"
import { GetRecordsQueryHandler } from "./get-records.query-handler"
import { GetShareQueryHandler } from "./get-share.query-handler"
import { GetTableByShareQueryHandler } from "./get-table-by-share.query-handler"
import { GetTableQueryHandler } from "./get-table.query-handler"
import { GetTablesByBaseIdQueryHandler } from "./get-tables-by-base-id.query-handler"
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
  GetRecordAuditsQueryHandler,
  GetBasesQueryHandler,
  GetBaseQueryHandler,
  GetTablesByBaseIdQueryHandler,
  GetMembersQueryHandler,
  GetMemberByIdQueryHandler,
  GetShareQueryHandler,
  GetTableByShareQueryHandler,
]
