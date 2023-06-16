import { RecordEvents } from '@undb/core'
import { IEventHandler } from '@undb/domain'
import { Subject } from 'rxjs'

export abstract class RealtimeEventsHandler implements IEventHandler<RecordEvents> {
  protected abstract subjects: Map<string, Subject<RecordEvents>>

  protected abstract getOrCreateSubject(tableId: string): Subject<RecordEvents>

  handle(event: RecordEvents): void {
    const tableId = event.payload.tableId
    const subject = this.getOrCreateSubject(tableId)

    subject.next(event)
  }
}
