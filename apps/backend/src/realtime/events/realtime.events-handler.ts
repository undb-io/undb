import { EventsHandler } from '@nestjs/cqrs'
import { RecordEventsClasses, type RecordEvents } from '@undb/core'
import { RealtimeEventsHandler } from '@undb/cqrs'
import { IEventHandler } from '@undb/domain'
import { Observable, Subject } from 'rxjs'

@EventsHandler(...RecordEventsClasses)
export class NestRealtimeEventsHandler extends RealtimeEventsHandler implements IEventHandler<RecordEvents> {
  protected subjects: Map<string, Subject<RecordEvents>> = new Map()

  protected getOrCreateSubject(tableId: string): Subject<RecordEvents> {
    const subject = this.subjects.get(tableId)
    if (!subject) {
      this.subjects.set(tableId, new Subject())
      return this.subjects.get(tableId)!
    }

    return subject
  }

  observe(tableId: string): Observable<RecordEvents> {
    return this.getOrCreateSubject(tableId).asObservable()
  }
}
