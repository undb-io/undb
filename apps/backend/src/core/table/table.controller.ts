import { Controller, MessageEvent, Param, Sse, UseGuards } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Observable, map, tap } from 'rxjs'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js'
import { NestRealtimeEventsHandler } from '../../realtime/events/realtime.events-handler.js'

@Controller('tables')
@UseGuards(JwtAuthGuard)
export class TableController {
  constructor(
    private readonly handler: NestRealtimeEventsHandler,
    @InjectPinoLogger(TableController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Sse('/:tableId/subscription')
  subscription(@Param('tableId') tableId: string): Observable<MessageEvent> {
    return this.handler.observe(tableId).pipe(
      map((event) => ({ data: { event }, id: event.id })),
      tap((message) => this.logger.info('handling subscription event %s', message.data.event.name)),
    )
  }
}
