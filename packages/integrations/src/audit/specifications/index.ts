import { subMinutes } from 'date-fns'

import { WithAuditOp } from './audit-op.specification.js'
import { WithAuditOperator } from './audit-operaotr.specification.js'
import { WithAuditTarget } from './audit-target.specification.js'
import { WithAuditAfter } from './audit-timestamp.specification.js'

export * from './audit-detail.specification.js'
export * from './audit-id.specification.js'
export * from './audit-op.specification.js'
export * from './audit-operaotr.specification.js'
export * from './audit-table-id.specification.js'
export * from './audit-target.specification.js'
export * from './audit-timestamp.specification.js'
export * from './interface.js'

export const lastRecordUpdatedAuditSpec = (recordId: string, operatorId: string) =>
  WithAuditTarget.fromRecordId(recordId)
    .and(WithAuditAfter.fromDate(subMinutes(new Date(), 1)))
    .and(new WithAuditOp('record.updated'))
    .and(new WithAuditOperator(operatorId))
