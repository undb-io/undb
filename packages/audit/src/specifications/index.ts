import { subMilliseconds } from "date-fns"

import { WithAuditOp } from "./audit-op.specification.js"
import { WithAuditOperator } from "./audit-operaotr.specification.js"
import { WithAuditRecordId } from "./audit-record-id.specification.js"
import { WithAuditAfter } from "./audit-timestamp.specification.js"

export * from "./audit-detail.specification.js"
export * from "./audit-id.specification.js"
export * from "./audit-op.specification.js"
export * from "./audit-operaotr.specification.js"
export * from "./audit-table-id.specification.js"
export * from "./audit-timestamp.specification.js"
export * from "./interface.js"

export const lastRecordUpdatedAuditSpec = (recordId: string, operatorId: string, millionSeconds: number = 1_000) =>
  WithAuditRecordId.from(recordId)
    .and(WithAuditAfter.fromDate(subMilliseconds(new Date(), millionSeconds)))
    .and(new WithAuditOp("record.updated"))
    .and(new WithAuditOperator(operatorId))
