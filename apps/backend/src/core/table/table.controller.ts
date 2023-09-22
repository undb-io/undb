import type { MessageEvent } from '@nestjs/common'
import { Controller, Get, Param, Res, Sse, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { type IExportType } from '@undb/core'
import { ExportGridCommand } from '@undb/cqrs'
import { type Response } from 'express'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Observable, map, tap } from 'rxjs'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js'
import { AuthzGuard } from '../../authz/authz.guard.js'
import { Permissions } from '../../authz/rbac/permission.decorator.js'
import { NestRealtimeEventsHandler } from '../../realtime/events/realtime.events-handler.js'
import { NestRecordExportorService } from './exportor/exportor.service.js'

@Controller('tables')
@UseGuards(JwtAuthGuard, AuthzGuard)
export class TableController {
  constructor(
    private commandBus: CommandBus,
    private readonly service: NestRecordExportorService,
    private readonly handler: NestRealtimeEventsHandler,
    @InjectPinoLogger(TableController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Get('/:tableId/:viewId/:type/export/grid')
  @Permissions('table:export')
  async exportGrid(
    @Param('tableId') tableId: string,
    @Param('viewId') viewId: string,
    @Param('type') type: IExportType,
    @Res() res: Response,
  ) {
    const cmd = new ExportGridCommand({ tableId, viewId, type })
    const data = await this.commandBus.execute(cmd)

    const contentType = this.service.getContentType(type)
    res.header('Content-Type', contentType)

    return res.send(data)
  }
  @Sse('/:tableId/subscription')
  subscription(@Param('tableId') tableId: string): Observable<MessageEvent> {
    return this.handler.observe(tableId).pipe(
      map((event) => ({ data: { event }, id: event.id })),
      tap((message) => this.logger.info('handling subscription event %s', message.data.event.name)),
    )
  }
}
