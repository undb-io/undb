import type { MessageEvent } from '@nestjs/common'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Sse, UseGuards, Version } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import {
  BulkDeleteRecordsCommand,
  BulkDuplicateRecordsCommand,
  DeleteRecordCommand,
  DuplicateRecordCommand,
  GetRecordQuery,
  GetRecordsQuery,
  RestoreRecordCommand,
} from '@undb/cqrs'
import { type IOpenAPIMutateRecordSchema } from '@undb/openapi'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Observable, map, tap } from 'rxjs'
import { OpenApiGuard } from '../auth/open-api.guard.js'
import { AuthzGuard } from '../authz/authz.guard.js'
import { Permissions } from '../authz/rbac/permission.decorator.js'
import { NestRealtimeEventsHandler } from '../realtime/events/realtime.events-handler.js'
import { OpenAPIRecordService } from './openapi-record.service.js'
import { API_TAG_RECORD, API_TAG_SUBSCRIPTION } from './openapi.constants.js'

@Controller({
  path: 'openapi',
  version: '1',
})
@ApiTags(API_TAG_RECORD)
@UseGuards(OpenApiGuard, AuthzGuard)
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
  @ApiQuery({ required: false, name: 'viewId' })
  public async getRecords(
    @Param('tableId') tableId: string,
    @Query('viewId')
    viewId?: string,
  ) {
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
  @Permissions('record:create')
  public async createRecord(
    @Param('tableId') tableId: string,
    @Body('id') id: string | undefined,
    @Body('values') values: IOpenAPIMutateRecordSchema,
  ) {
    await this.service.createRecord(tableId, id, values)
  }

  @Version('1')
  @Post('tables/:tableId/records/bulk')
  @Permissions('record:create')
  public async createRecords(
    @Param('tableId') tableId: string,
    @Body('records') records: { id?: string; values: IOpenAPIMutateRecordSchema }[],
  ) {
    await this.service.createRecords(tableId, records)
  }

  @Version('1')
  @Patch('tables/:tableId/records')
  @Permissions('record:update')
  public async updateRecord(
    @Param('tableId') tableId: string,
    @Body('id') id: string,
    @Body('values') values: IOpenAPIMutateRecordSchema,
  ) {
    await this.service.updateRecord(tableId, id, values)
  }

  @Version('1')
  @Patch('tables/:tableId/records/bulk')
  @Permissions('record:update')
  public async updateRecords(
    @Param('tableId') tableId: string,
    @Body('records') records: { id: string; values: IOpenAPIMutateRecordSchema }[],
  ) {
    await this.service.updateRecords(tableId, records)
  }

  @Version('1')
  @Delete('tables/:tableId/records/:id')
  @Permissions('record:delete')
  public async deleteRecord(@Param('tableId') tableId: string, @Param('id') id: string) {
    await this.commandBus.execute(new DeleteRecordCommand({ tableId, id }))
  }

  @Version('1')
  @Post('tables/:tableId/records/:id/restore')
  @Permissions('record:create')
  public async restoreRecord(@Param('tableId') tableId: string, @Param('id') id: string) {
    await this.commandBus.execute(new RestoreRecordCommand({ tableId, id }))
  }

  @Version('1')
  @Delete('tables/:tableId/records')
  @Permissions('record:delete')
  public async deleteRecordsByIds(@Param('tableId') tableId: string, @Body('ids') ids: [string, ...string[]]) {
    await this.commandBus.execute(new BulkDeleteRecordsCommand({ tableId, ids }))
  }

  @Version('1')
  @Post('tables/:tableId/records/:id')
  @Permissions('record:create')
  public async duplicateRecordById(@Param('tableId') tableId: string, @Param('id') id: string) {
    await this.commandBus.execute(new DuplicateRecordCommand({ tableId, id }))
  }

  @Version('1')
  @Post('tables/:tableId/records')
  @Permissions('record:create')
  public async duplicateRecordsByIds(@Param('tableId') tableId: string, @Body('ids') ids: [string, ...string[]]) {
    await this.commandBus.execute(new BulkDuplicateRecordsCommand({ tableId, ids }))
  }

  @Sse('tables/:tableId/subscription')
  @ApiTags(API_TAG_SUBSCRIPTION)
  subscription(@Param('tableId') tableId: string): Observable<MessageEvent> {
    return this.handler.observe(tableId).pipe(
      map((event) => ({ data: { event }, id: event.id })),
      tap((message) => this.logger.info('handling subscription event %s', message.data.event.name)),
    )
  }
}
