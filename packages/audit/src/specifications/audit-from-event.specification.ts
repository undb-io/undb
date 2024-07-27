import type { IRecordEvent, RECORD_EVENTS } from "@undb/table"
import { omit } from "radash"
import { match } from "ts-pattern"
import type { IAuditDetail, IRecordDeletedAuditDetail, IRecordUpdatedAuditDetail } from "../audit-detail.vo"
import { WithAuditDetail } from "./audit-detail.specification"
import { WithAuditId } from "./audit-id.specification"
import { WithAuditMetaSpec } from "./audit-meta.specification"
import { WithAuditOp } from "./audit-op.specification"
import { WithAuditOperator } from "./audit-operaotr.specification"
import { WithAuditRecordId } from "./audit-record-id.specification"
import { WithAuditTableId } from "./audit-table-id.specification"
import { WithAuditTimestamp } from "./audit-timestamp.specification"
import type { AuditSpecification } from "./interface"

const createRecordAuditSpec = (
  name: RECORD_EVENTS,
  timestamp: Date,
  id: string,
  tableId: string,
  operatorId: string,
  detail: IAuditDetail = null,
  meta: Record<string, unknown> = {},
) =>
  WithAuditId.create()
    .and(new WithAuditOp(name))
    .and(WithAuditTimestamp.fromDate(timestamp))
    .and(WithAuditRecordId.from(id))
    .and(new WithAuditOperator(operatorId))
    .and(WithAuditDetail.from(detail))
    .and(new WithAuditMetaSpec(meta))
    .and(WithAuditTableId.from(tableId))

export const getAuditSpecsFromEvent = (event: IRecordEvent): AuditSpecification[] => {
  return match(event)
    .with({ name: "record.created" }, (event) => [
      createRecordAuditSpec(
        event.name,
        event.timestamp,
        event.payload.id,
        event.payload.tableId,
        event.operatorId!,
        null,
        event.meta,
      ),
    ])
    .with({ name: "record.updated" }, (event) => [
      createRecordAuditSpec(
        event.name,
        event.timestamp,
        event.payload.id,
        event.payload.tableId,
        event.operatorId!,
        omit(event.payload, ["tableId", "id"]) satisfies IRecordUpdatedAuditDetail,
        event.meta,
      ),
    ])
    .with({ name: "record.deleted" }, (event) => [
      createRecordAuditSpec(event.name, event.timestamp, event.payload.id, event.payload.tableId, event.operatorId!, {
        name: event.name,
      } satisfies IRecordDeletedAuditDetail),
    ])
    .exhaustive()
}
