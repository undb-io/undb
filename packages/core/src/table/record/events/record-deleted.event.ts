import type { IEvent } from '@undb/domain'

export const EVT_RECORD_DELETED = 'record.deleted'

export class RecordDeletedEvent implements IEvent {
  public readonly name = EVT_RECORD_DELETED

  constructor(public readonly payload: { id: string }) {}

  static from(id: string): RecordDeletedEvent {
    return new this({ id })
  }
}
