import { EVT_RECORD_CREATED, EVT_RECORD_DELETED, RecordCreatedEvent, RecordDeletedEvent } from './table'

export class EventFactory {
  static create(name: string, payload: any) {
    switch (name) {
      case EVT_RECORD_CREATED:
        return new RecordCreatedEvent(payload)
      case EVT_RECORD_DELETED:
        return new RecordDeletedEvent(payload)

      default:
        return null
    }
  }
}
