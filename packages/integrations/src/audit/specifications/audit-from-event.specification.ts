import type { RecordEvents } from '@undb/core'
import { omit } from 'lodash-es'
import { match } from 'ts-pattern'
import type { IAuditDetail, IRecordDeletedAuditDetail, IRecordUpdatedAuditDetail } from '../audit-detail.vo'
import { WithAuditDetail } from './audit-detail.specification'
import { WithAuditId } from './audit-id.specification'
import { WithAuditOp } from './audit-op.specification'
import { WithAuditOperator } from './audit-operaotr.specification'
import { WithAuditTableId } from './audit-table-id.specification'
import { WithAuditTarget } from './audit-target.specification'
import { WithAuditTimestamp } from './audit-timestamp.specification'
import type { AuditSpecification } from './interface'

const createRecordAuditSpec = (
  name: string,
  timestamp: Date,
  id: string,
  tableId: string,
  operatorId: string,
  detail: IAuditDetail = null,
) =>
  WithAuditId.create()
    .and(new WithAuditOp(name))
    .and(WithAuditTimestamp.fromDate(timestamp))
    .and(WithAuditTarget.fromRecordId(id))
    .and(new WithAuditOperator(operatorId))
    .and(WithAuditDetail.from(detail))
    .and(WithAuditTableId.from(tableId))

export const getAuditSpecsFromEvent = (event: RecordEvents): AuditSpecification[] => {
  return match(event)
    .with(
      {
        name: 'record.created',
      },
      (event) => [
        createRecordAuditSpec(event.name, event.timestamp, event.payload.id, event.payload.tableId, event.operatorId),
      ],
    )
    .with(
      {
        name: 'record.updated',
      },
      (event) => [
        createRecordAuditSpec(
          event.name,
          event.timestamp,
          event.payload.id,
          event.payload.tableId,
          event.operatorId,
          omit(event.payload, ['tableId', 'tableName', 'id']) satisfies IRecordUpdatedAuditDetail,
        ),
      ],
    )
    .with(
      {
        name: 'record.deleted',
      },
      (event) => [
        createRecordAuditSpec(event.name, event.timestamp, event.payload.id, event.payload.tableId, event.operatorId, {
          name: event.payload.name,
        } satisfies IRecordDeletedAuditDetail),
      ],
    )
    .with(
      {
        name: 'record.bulk_created',
      },
      (event) =>
        event.payload.records.map((record) =>
          createRecordAuditSpec('record.created', event.timestamp, record.id, event.payload.tableId, event.operatorId),
        ),
    )
    .with(
      {
        name: 'record.bulk_updated',
      },
      (event) =>
        event.payload.updates.map((update) =>
          createRecordAuditSpec('record.updated', event.timestamp, update.id, event.payload.tableId, event.operatorId, {
            schema: event.payload.schema,
            previousSchema: event.payload.previousSchema,
            record: update.record,
            previousRecord: update.previousRecord,
          } satisfies IRecordUpdatedAuditDetail),
        ),
    )
    .with(
      {
        name: 'record.bulk_deleted',
      },
      (event) =>
        event.payload.records.map((record) =>
          createRecordAuditSpec('record.deleted', event.timestamp, record.id, event.payload.tableId, event.operatorId, {
            name: record.name,
          } satisfies IRecordDeletedAuditDetail),
        ),
    )
    .exhaustive()
}
