import type { JsonObject } from 'type-fest'
import { EVT_RECORD_CREATED, RecordCreatedEvent } from './table'

export class EventFactory {
  static create(name: string, payload: JsonObject) {
    switch (name) {
      case EVT_RECORD_CREATED:
        return new RecordCreatedEvent(payload)

      default:
        return null
    }
  }
}
