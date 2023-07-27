import {
  EVT_RECORD_BULK_CREATED,
  EVT_RECORD_BULK_DELETED,
  EVT_RECORD_BULK_UPDATED,
  EVT_RECORD_CREATED,
  EVT_RECORD_DELETED,
  EVT_RECORD_RESTORED,
  EVT_RECORD_UPDATED,
  type RecordEvents,
} from '@undb/core'
import { omit } from 'lodash-es'
import { match } from 'ts-pattern'
import type {
  IAuditDetail,
  IRecordDeletedAuditDetail,
  IRecordRestoredAuditDetail,
  IRecordUpdatedAuditDetail,
} from '../audit-detail.vo'
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
        name: EVT_RECORD_CREATED,
      },
      (event) => [
        createRecordAuditSpec(event.name, event.timestamp, event.payload.id, event.payload.tableId, event.operatorId),
      ],
    )
    .with(
      {
        name: EVT_RECORD_UPDATED,
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
        name: EVT_RECORD_DELETED,
      },
      (event) => [
        createRecordAuditSpec(event.name, event.timestamp, event.payload.id, event.payload.tableId, event.operatorId, {
          name: event.payload.name,
        } satisfies IRecordDeletedAuditDetail),
      ],
    )
    .with(
      {
        name: EVT_RECORD_RESTORED,
      },
      (event) => [
        createRecordAuditSpec(event.name, event.timestamp, event.payload.id, event.payload.tableId, event.operatorId, {
          name: event.payload.name,
        } satisfies IRecordRestoredAuditDetail),
      ],
    )
    .with(
      {
        name: EVT_RECORD_BULK_CREATED,
      },
      (event) =>
        event.payload.records.map((record) =>
          createRecordAuditSpec(
            EVT_RECORD_CREATED,
            event.timestamp,
            record.id,
            event.payload.tableId,
            event.operatorId,
          ),
        ),
    )
    .with(
      {
        name: EVT_RECORD_BULK_UPDATED,
      },
      (event) =>
        event.payload.updates.map((update) =>
          createRecordAuditSpec(
            EVT_RECORD_UPDATED,
            event.timestamp,
            update.id,
            event.payload.tableId,
            event.operatorId,
            {
              schema: event.payload.schema,
              previousSchema: event.payload.previousSchema,
              record: update.record,
              previousRecord: update.previousRecord,
            } satisfies IRecordUpdatedAuditDetail,
          ),
        ),
    )
    .with(
      {
        name: EVT_RECORD_BULK_DELETED,
      },
      (event) =>
        event.payload.records.map((record) =>
          createRecordAuditSpec(
            EVT_RECORD_DELETED,
            event.timestamp,
            record.id,
            event.payload.tableId,
            event.operatorId,
            {
              name: record.name,
            } satisfies IRecordDeletedAuditDetail,
          ),
        ),
    )
    .exhaustive()
}
