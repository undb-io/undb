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
  static create(id: string, operatorId: string, name: string, payload: any) {
    switch (name) {
      case EVT_RECORD_CREATED:
        return new RecordCreatedEvent(payload, operatorId, id)
      case EVT_RECORD_DELETED:
        return new RecordDeletedEvent(payload, operatorId, id)
      case EVT_RECORD_UPDATED:
        return new RecordUpdatedEvent(payload, operatorId, id)
      case EVT_RECORD_BULK_CREATED:
        return new RecordBulkCreatedEvent(payload, operatorId, id)
      case EVT_RECORD_BULK_DELETED:
        return new RecordBulkDeletedEvent(payload, operatorId, id)
      case EVT_RECORD_BULK_UPDATED:
        return new RecordBulkUpdatedEvent(payload, operatorId, id)

      default:
        return null
    }
  }
}
