import type { RecordEvents } from '@undb/core'
import { match } from 'ts-pattern'
import { WithAuditDetail } from './audit-detail.specification'
import { WithAuditId } from './audit-id.specification'
import { WithAuditOp } from './audit-op.specification'
import { WithAuditOperator } from './audit-operaotr.specification'
import { WithAuditTarget } from './audit-target.specification'
import { WithAuditTimestamp } from './audit-timestamp.specification'
import type { AuditSpecification } from './interface'

const createRecordAuditSpec = (
  name: string,
  timestamp: Date,
  id: string,
  operatorId: string,
  detail: object | null = null,
) =>
  WithAuditId.create()
    .and(new WithAuditOp(name))
    .and(WithAuditTimestamp.fromDate(timestamp))
    .and(WithAuditTarget.fromRecordId(id))
    .and(new WithAuditOperator(operatorId))
    .and(WithAuditDetail.from(detail))

export const getAuditSpecsFromEvent = (event: RecordEvents): AuditSpecification[] => {
  return match(event)
    .with(
      {
        name: 'record.created',
      },
      (event) => [createRecordAuditSpec(event.name, event.timestamp, event.payload.id, event.operatorId)],
    )
    .with(
      {
        name: 'record.updated',
      },
      (event) => [createRecordAuditSpec(event.name, event.timestamp, event.payload.id, event.operatorId)],
    )
    .with(
      {
        name: 'record.deleted',
      },
      (event) => [createRecordAuditSpec(event.name, event.timestamp, event.payload.id, event.operatorId)],
    )
    .with(
      {
        name: 'record.bulk_created',
      },
      (event) =>
        event.payload.records.map((record) =>
          createRecordAuditSpec('record.created', event.timestamp, record.id, event.operatorId),
        ),
    )
    .with(
      {
        name: 'record.bulk_updated',
      },
      (event) =>
        event.payload.updates.map((update) =>
          createRecordAuditSpec('record.updated', event.timestamp, update.id, event.operatorId),
        ),
    )
    .with(
      {
        name: 'record.bulk_deleted',
      },
      (event) =>
        event.payload.records.map((r) =>
          createRecordAuditSpec('record.deleted', event.timestamp, r.id, event.operatorId),
        ),
    )
    .exhaustive()
}
