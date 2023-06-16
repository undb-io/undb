import { EventsHandler } from '@nestjs/cqrs'
import { IRecordEvents, RecordEvents } from '@undb/core'
import { RealtimeEventsHandler } from '@undb/cqrs'
import { IEventHandler } from '@undb/domain'
import { Observable, Subject } from 'rxjs'

@EventsHandler(...RecordEvents)
export class NestRealtimeEventsHandler extends RealtimeEventsHandler implements IEventHandler<IRecordEvents> {
  protected subjects: Map<string, Subject<IRecordEvents>> = new Map()

  protected getOrCreateSubject(tableId: string): Subject<IRecordEvents> {
    const subject = this.subjects.get(tableId)
    if (!subject) {
      this.subjects.set(tableId, new Subject())
      return this.subjects.get(tableId)!
    }

    return subject
  }

  observe(tableId: string): Observable<IRecordEvents> {
    return this.getOrCreateSubject(tableId).asObservable()
  }
}
