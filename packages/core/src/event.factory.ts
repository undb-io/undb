import { EVT_RECORD_CREATED, EVT_RECORD_DELETED, RecordCreatedEvent, RecordDeletedEvent } from './table'

export class EventFactory {
  static create(id: string, name: string, payload: any) {
    switch (name) {
      case EVT_RECORD_CREATED:
        return new RecordCreatedEvent(payload, id)
      case EVT_RECORD_DELETED:
        return new RecordDeletedEvent(payload, id)

      default:
        return null
    }
  }
}
