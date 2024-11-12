import { CountRecordsQueryHandler } from "./count-records.query-handler"
import { GetAggregatesQueryHandler } from "./get-aggregates.query-handler"
import { GetApiTokensQueryHandler } from "./get-api-tokens.query-handler"
import { GetBaseByShareQueryHandler } from "./get-base-by-share.query-handler"
import { GetBaseShareQueryHandler } from "./get-base-share.query-handler"
import { GetBaseQueryHandler } from "./get-base.query-handler"
import { GetBasesQueryHandler } from "./get-bases.query-handler"
import { GetDashboardByIdQueryHandler } from "./get-dashboard-by-id.query-handler"
import { GetDashboardByShareQueryHandler } from "./get-dashboard-by-share.query-handler"
import { GetDashboardsQueryHandler } from "./get-dashboards.query-handler"
import { GetInivitationsQueryHandler } from "./get-invitations.query-handler"
import { GetMemberByIdQueryHandler } from "./get-member-by-id.query-handler"
import { GetMemberSpacesQueryHandler } from "./get-member-spaces.query-handler"
import { GetMembersByIdsQueryHandler } from "./get-members-by-ids.query-handler"
import { GetMembersQueryHandler } from "./get-members.query-handler"
import { GetPivotDataQueryHandler } from "./get-pivot-data.query-handler"
import { GetReadableRecordByIdHandler } from "./get-readable-record-by-id.query-handler"
import { GetReadableRecordsHandler } from "./get-readable-records.query-handler"
import { GetRecordAuditsQueryHandler } from "./get-record-audits.query-handler"
import { GetRecordByIdQueryHandler } from "./get-record-by-id.query-handler"
import { GetRecordsQueryHandler } from "./get-records.query-handler"
import { GetRollupForeignTablesTablesQueryHandler } from "./get-rollup-foreign-tables.query-handler"
import { GetShareAggregatesQueryHandler } from "./get-share-aggregates.query-handler"
import { GetSharePivotDataQueryHandler } from "./get-share-pivot-data.query-handler"
import { GetShareRecordByIdQueryHandler } from "./get-share-record-by-id.query-handler"
import { GetShareRecordsQueryHandler } from "./get-share-records.query-handler"
import { GetShareQueryHandler } from "./get-share.query-handler"
import { GetSpaceByIdQueryHandler } from "./get-space-by-id.query-handler"
import { GetSpaceMemberQueryHandler } from "./get-space-member.query-handler"
import { GetTableByShareBaseQueryHandler } from "./get-table-by-share-base.query-handler"
import { GetTableByShareDashboardQueryHandler } from "./get-table-by-share-dashboard.query-handler"
import { GetTableByShareQueryHandler } from "./get-table-by-share.query-handler"
import { GetTableForeignTablesQueryHandler } from "./get-table-foreign-tables.query-handler"
import { GetTableQueryHandler } from "./get-table.query-handler"
import { GetTablesByBaseIdQueryHandler } from "./get-tables-by-base-id.query-handler"
import { GetTablesQueryHandler } from "./get-tables.query-handler"
import { GetTemplateQueryHandler } from "./get-template.query-handler"
import { GetTemplatesQueryHandler } from "./get-templates.query-handler"
import { GetWebhooksQueryHandler } from "./get-webhooks.query-handler"

export const queryHandlers = [
  GetTablesQueryHandler,
  GetTableQueryHandler,
  GetRecordsQueryHandler,
  GetShareRecordsQueryHandler,
  GetShareRecordByIdQueryHandler,
  GetRecordByIdQueryHandler,
  GetReadableRecordsHandler,
  GetAggregatesQueryHandler,
  GetReadableRecordByIdHandler,
  GetWebhooksQueryHandler,
  GetRecordAuditsQueryHandler,
  GetBasesQueryHandler,
  GetBaseQueryHandler,
  GetTablesByBaseIdQueryHandler,
  GetTableForeignTablesQueryHandler,
  GetMembersQueryHandler,
  GetMemberByIdQueryHandler,
  GetMembersByIdsQueryHandler,
  GetMemberSpacesQueryHandler,
  GetShareQueryHandler,
  GetTableByShareQueryHandler,
  CountRecordsQueryHandler,
  GetRollupForeignTablesTablesQueryHandler,
  GetInivitationsQueryHandler,
  GetApiTokensQueryHandler,
  GetSpaceByIdQueryHandler,
  GetSpaceMemberQueryHandler,
  GetBaseShareQueryHandler,
  GetBaseByShareQueryHandler,
  GetTableByShareBaseQueryHandler,
  GetTemplatesQueryHandler,
  GetTemplateQueryHandler,
  GetShareAggregatesQueryHandler,
  GetDashboardsQueryHandler,
  GetDashboardByIdQueryHandler,
  GetDashboardByShareQueryHandler,
  GetTableByShareDashboardQueryHandler,
  GetPivotDataQueryHandler,
  GetSharePivotDataQueryHandler,
]
