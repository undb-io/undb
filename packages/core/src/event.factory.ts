import {
  EVT_RECORD_BULK_CREATED,
  EVT_RECORD_BULK_DELETED,
  EVT_RECORD_BULK_UPDATED,
  EVT_RECORD_CREATED,
  EVT_RECORD_DELETED,
  EVT_RECORD_UPDATED,
  RecordBulkCreatedEvent,
  RecordBulkDeletedEvent,
  RecordBulkUpdatedEvent,
  RecordCreatedEvent,
  RecordDeletedEvent,
  RecordUpdatedEvent,
} from './table/index.js'

export class EventFactory {
  static create(id: string, name: string, payload: any) {
    switch (name) {
      case EVT_RECORD_CREATED:
        return new RecordCreatedEvent(payload, id)
      case EVT_RECORD_DELETED:
        return new RecordDeletedEvent(payload, id)
      case EVT_RECORD_UPDATED:
        return new RecordUpdatedEvent(payload, id)
      case EVT_RECORD_BULK_CREATED:
        return new RecordBulkCreatedEvent(payload, id)
      case EVT_RECORD_BULK_DELETED:
        return new RecordBulkDeletedEvent(payload, id)
      case EVT_RECORD_BULK_UPDATED:
        return new RecordBulkUpdatedEvent(payload, id)

      default:
        return null
    }
  }
}
