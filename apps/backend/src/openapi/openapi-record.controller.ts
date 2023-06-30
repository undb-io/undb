import type { MessageEvent } from '@nestjs/common'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Sse, UseGuards, Version } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import {
  BulkDeleteRecordsCommand,
  BulkDuplicateRecordsCommand,
  DeleteRecordCommand,
  DuplicateRecordCommand,
  GetRecordQuery,
  GetRecordsQuery,
} from '@undb/cqrs'
import { type IOpenAPIMutateRecordSchema } from '@undb/openapi'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Observable, map, tap } from 'rxjs'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { NestRealtimeEventsHandler } from '../realtime/events/realtime.events-handler.js'
import { OpenAPIRecordService } from './openapi-record.service.js'

@Controller({
  path: 'openapi',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class OpenAPIRecordController {
  constructor(
    private queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly service: OpenAPIRecordService,
    private readonly handler: NestRealtimeEventsHandler,
    @InjectPinoLogger(OpenAPIRecordController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Version('1')
  @Get('tables/:tableId/records')
  public async getRecords(@Param('tableId') tableId: string, @Query('viewId') viewId?: string) {
    const result = await this.queryBus.execute(new GetRecordsQuery({ tableId, viewId }))
    const records = await this.service.mapMany(tableId, result.records ?? [])
    return { records }
  }

  @Version('1')
  @Get('tables/:tableId/records/:id')
  public async getRecordById(@Param('tableId') tableId: string, @Param('id') id: string) {
    const result = await this.queryBus.execute(new GetRecordQuery({ tableId, id }))
    const record = result ? await this.service.mapMany(tableId, result) : null
    return { record }
  }

  @Version('1')
  @Post('tables/:tableId/records')
  public async createRecord(
    @Param('tableId') tableId: string,
    @Body('id') id: string | undefined,
    @Body('values') values: IOpenAPIMutateRecordSchema,
  ) {
    await this.service.createRecord(tableId, id, values)
  }

  @Version('1')
  @Post('tables/:tableId/records/bulk')
  public async createRecords(
    @Param('tableId') tableId: string,
    @Body('records') records: { id?: string; values: IOpenAPIMutateRecordSchema }[],
  ) {
    await this.service.createRecords(tableId, records)
  }

  @Version('1')
  @Patch('tables/:tableId/records')
  public async updateRecord(
    @Param('tableId') tableId: string,
    @Body('id') id: string,
    @Body('values') values: IOpenAPIMutateRecordSchema,
  ) {
    await this.service.updateRecord(tableId, id, values)
  }

  @Version('1')
  @Patch('tables/:tableId/records/bulk')
  public async updateRecords(
    @Param('tableId') tableId: string,
    @Body('records') records: { id: string; values: IOpenAPIMutateRecordSchema }[],
  ) {
    await this.service.updateRecords(tableId, records)
  }

  @Version('1')
  @Delete('tables/:tableId/records/:id')
  public async deleteRecord(@Param('tableId') tableId: string, @Param('id') id: string) {
    await this.commandBus.execute(new DeleteRecordCommand({ tableId, id }))
  }

  @Version('1')
  @Delete('tables/:tableId/records')
  public async deleteRecordsByIds(@Param('tableId') tableId: string, @Body('ids') ids: [string, ...string[]]) {
    await this.commandBus.execute(new BulkDeleteRecordsCommand({ tableId, ids }))
  }

  @Version('1')
  @Post('tables/:tableId/records/:id')
  public async duplicateRecordById(@Param('tableId') tableId: string, @Param('id') id: string) {
    await this.commandBus.execute(new DuplicateRecordCommand({ tableId, id }))
  }

  @Version('1')
  @Post('tables/:tableId/records')
  public async duplicateRecordsByIds(@Param('tableId') tableId: string, @Body('ids') ids: [string, ...string[]]) {
    await this.commandBus.execute(new BulkDuplicateRecordsCommand({ tableId, ids }))
  }

  @Sse('tables/:tableId/subscription')
  subscription(@Param('tableId') tableId: string): Observable<MessageEvent> {
    return this.handler.observe(tableId).pipe(
      map((event) => ({ data: { event }, id: event.id })),
      tap((message) => this.logger.info('handling subscription event %s', message.data.event.name)),
    )
  }
}
