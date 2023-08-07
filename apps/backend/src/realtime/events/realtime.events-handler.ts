import { EventsHandler } from '@nestjs/cqrs'
import type { ClsStore } from '@undb/core'
import { RecordEventsClasses, isAnonymous, type RecordEvents } from '@undb/core'
import { RealtimeEventsHandler } from '@undb/cqrs'
import type { IEventHandler } from '@undb/domain'
import { ClsService } from 'nestjs-cls'
import type { Observable } from 'rxjs'
import { Subject } from 'rxjs'
import { NestRLSAuthzService } from '../../authz/rls/rls-authz.service.js'

@EventsHandler(...RecordEventsClasses)
export class NestRealtimeEventsHandler extends RealtimeEventsHandler implements IEventHandler<RecordEvents> {
  constructor(
    protected readonly cls: ClsService<ClsStore>,
    protected readonly rls: NestRLSAuthzService,
  ) {
    super(rls)
  }

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

  async handle(event: RecordEvents): Promise<void> {
    await this.cls.run(async () => {
      this.cls.set('user.userId', event.operatorId)
      this.cls.set('user.isAnonymous', isAnonymous(event.operatorId))
      await super.handle(event)
    })
  }
}
