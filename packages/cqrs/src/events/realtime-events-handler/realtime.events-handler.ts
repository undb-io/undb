import { IRecordEvents } from '@undb/core'
import { IEventHandler } from '@undb/domain'
import { Subject } from 'rxjs'

export abstract class RealtimeEventsHandler implements IEventHandler<IRecordEvents> {
  protected abstract subjects: Map<string, Subject<IRecordEvents>>

  protected abstract getOrCreateSubject(tableId: string): Subject<IRecordEvents>

  handle(event: IRecordEvents): void {
    const tableId = event.payload.tableId
    const subject = this.getOrCreateSubject(tableId)

    subject.next(event)
  }
}
