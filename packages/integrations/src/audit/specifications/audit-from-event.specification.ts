import type { RecordEvents } from '@undb/core'
import { match } from 'ts-pattern'
import { WithAuditId } from './audit-id.specification'
import { WithAuditOp } from './audit-op.specification'
import { WithAuditTarget } from './audit-target.specification'
import { WithAuditTimestamp } from './audit-timestamp.specification'
import type { AuditSpecification } from './interface'

export const getAuditSpecsFromEvent = (event: RecordEvents): AuditSpecification[] => {
  return match(event)
    .with({ name: 'record.created' }, (event) => [
      WithAuditId.create()
        .and(new WithAuditOp(event.name))
        .and(WithAuditTimestamp.fromDate(event.timestamp))
        .and(WithAuditTarget.fromRecordId(event.payload.id)),
    ])
    .with({ name: 'record.updated' }, (event) => [
      WithAuditId.create()
        .and(new WithAuditOp(event.name))
        .and(WithAuditTimestamp.fromDate(event.timestamp))
        .and(WithAuditTarget.fromRecordId(event.payload.id)),
    ])
    .with({ name: 'record.deleted' }, (event) => [
      WithAuditId.create()
        .and(new WithAuditOp(event.name))
        .and(WithAuditTimestamp.fromDate(event.timestamp))
        .and(WithAuditTarget.fromRecordId(event.payload.id)),
    ])
    .with({ name: 'record.bulk_created' }, (event) =>
      event.payload.records.map((record) =>
        WithAuditId.create()
          .and(new WithAuditOp('record.created'))
          .and(WithAuditTimestamp.fromDate(event.timestamp))
          .and(WithAuditTarget.fromRecordId(record.id)),
      ),
    )
    .with({ name: 'record.bulk_updated' }, (event) =>
      event.payload.updates.map((update) =>
        WithAuditId.create()
          .and(new WithAuditOp('record.updated'))
          .and(WithAuditTimestamp.fromDate(event.timestamp))
          .and(WithAuditTarget.fromRecordId(update.id)),
      ),
    )
    .with({ name: 'record.bulk_deleted' }, (event) =>
      event.payload.records.map((r) =>
        WithAuditId.create()
          .and(new WithAuditOp('record.deleted'))
          .and(WithAuditTimestamp.fromDate(event.timestamp))
          .and(WithAuditTarget.fromRecordId(r.id)),
      ),
    )
    .exhaustive()
}
