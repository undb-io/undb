import type { IRLSAuthzService } from '@undb/authz'
import type { RecordEvents } from '@undb/core'
import type { IEventHandler } from '@undb/domain'
import type { Subject } from 'rxjs'

export abstract class RealtimeEventsHandler implements IEventHandler<RecordEvents> {
  constructor(protected readonly rls: IRLSAuthzService) {}

  protected abstract subjects: Map<string, Subject<RecordEvents>>

  protected abstract getOrCreateSubject(tableId: string): Subject<RecordEvents>

  async handle(event: RecordEvents): Promise<void> {
    const tableId = event.payload.tableId
    const subject = this.getOrCreateSubject(tableId)

    subject.next(event)
  }
}
