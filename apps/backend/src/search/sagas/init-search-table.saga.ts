import { Injectable } from '@nestjs/common'
import { Saga, UnhandledExceptionBus, ofType } from '@nestjs/cqrs'
import { TableCreatedEvent } from '@undb/core'
import { InitTableSearchCommand } from '@undb/cqrs'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import type { Observable } from 'rxjs'
import { Subject, map, takeUntil } from 'rxjs'

@Injectable()
export class InitSearchTableSaga {
  private destroy$ = new Subject<void>()

  constructor(
    @InjectPinoLogger()
    private readonly logger: PinoLogger,
    private unhandledExceptionsBus: UnhandledExceptionBus,
  ) {
    this.unhandledExceptionsBus.pipe(takeUntil(this.destroy$)).subscribe((exceptionInfo) => {
      this.logger.error(exceptionInfo.exception)
    })
  }

  onModuleDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  @Saga()
  initTable = (events$: Observable<any>) => {
    return events$.pipe(
      ofType(TableCreatedEvent),
      map((event) => new InitTableSearchCommand({ tableId: event.payload.id })),
    )
  }
}
