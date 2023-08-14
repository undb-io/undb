import type { IEventJSON } from '@undb/domain'
import { match } from 'ts-pattern'
import {
  EVT_RECORD_BULK_CREATED,
  EVT_RECORD_BULK_DELETED,
  EVT_RECORD_BULK_UPDATED,
  EVT_RECORD_CREATED,
  EVT_RECORD_DELETED,
  EVT_RECORD_RESTORED,
  EVT_RECORD_UPDATED,
  RecordBulkCreatedEvent,
  RecordBulkDeletedEvent,
  RecordBulkUpdatedEvent,
  RecordCreatedEvent,
  RecordDeletedEvent,
  RecordRestoredEvent,
  RecordUpdatedEvent,
} from './table/index.js'

export class EventFactory {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static create(id: string, operatorId: string, name: string, payload: any, meta: any, timestamp: Date) {
    return match(name)
      .with(EVT_RECORD_CREATED, () => new RecordCreatedEvent(payload, operatorId, meta, id, timestamp))
      .with(EVT_RECORD_UPDATED, () => new RecordUpdatedEvent(payload, operatorId, meta, id, timestamp))
      .with(EVT_RECORD_DELETED, () => new RecordDeletedEvent(payload, operatorId, meta, id, timestamp))
      .with(EVT_RECORD_RESTORED, () => new RecordRestoredEvent(payload, operatorId, meta, id, timestamp))
      .with(EVT_RECORD_BULK_CREATED, () => new RecordBulkCreatedEvent(payload, operatorId, meta, id, timestamp))
      .with(EVT_RECORD_BULK_UPDATED, () => new RecordBulkUpdatedEvent(payload, operatorId, meta, id, timestamp))
      .with(EVT_RECORD_BULK_DELETED, () => new RecordBulkDeletedEvent(payload, operatorId, meta, id, timestamp))
      .otherwise(() => null)
  }

  static fromJSON(json: IEventJSON) {
    return this.create(json.id, json.operatorId, json.name, json.payload, json.meta, new Date(json.timestamp))
  }
}
