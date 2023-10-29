import type { MessageEvent } from '@nestjs/common'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Sse, UseGuards, Version } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import type { IGetRecordOutput } from '@undb/cqrs'
import {
  BulkDeleteRecordsCommand,
  BulkDuplicateRecordsCommand,
  DeleteRecordCommand,
  DuplicateRecordCommand,
  GetRecordQuery,
  GetRecordsQuery,
  RestoreRecordCommand,
} from '@undb/cqrs'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { Observable, map, tap } from 'rxjs'
import { OpenApiGuard } from '../auth/open-api.guard.js'
import { AuthzGuard } from '../authz/authz.guard.js'
import { Permissions } from '../authz/rbac/permission.decorator.js'
import { NestRealtimeEventsHandler } from '../realtime/events/realtime.events-handler.js'
import {
  CreateRecordBulkDTO,
  CreateRecordDTO,
  DeleteRecordsBulkDTO,
  DuplicateRecordsBulkDTO,
  UpdateRecordBulkDTO,
  UpdateRecordDTO,
} from './dtos/record.dto.js'
import { OpenAPIRecordService } from './openapi-record.service.js'
import { API_TAG_RECORD, API_TAG_SUBSCRIPTION } from './openapi.constants.js'

@Controller({
  path: 'openapi',
  version: '1',
})
@UseGuards(OpenApiGuard, AuthzGuard)
@ApiTags(API_TAG_RECORD)
@ApiBearerAuth()
@ApiForbiddenResponse()
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
  @ApiOperation({ summary: 'get all records' })
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
  @ApiOperation({ summary: 'get record by id' })
  public async getRecordById(@Param('tableId') tableId: string, @Param('id') id: string) {
    const result: IGetRecordOutput = await this.queryBus.execute(new GetRecordQuery({ tableId, id }))
    const record = result ? await this.service.map(tableId, result) : null
    return { record }
  }

  @Version('1')
  @Post('tables/:tableId/records')
  @Permissions('record:create')
  @ApiOperation({ summary: 'create new record' })
  public async createRecord(@Param('tableId') tableId: string, @Body() { id, values }: CreateRecordDTO) {
    await this.service.createRecord(tableId, id, values)
  }

  @Version('1')
  @Post('tables/:tableId/records/bulk')
  @Permissions('record:create')
  @ApiOperation({ summary: 'create new records bulk' })
  public async createRecords(@Param('tableId') tableId: string, @Body() { records }: CreateRecordBulkDTO) {
    await this.service.createRecords(tableId, records)
  }

  @Version('1')
  @Patch('tables/:tableId/records/:id')
  @Permissions('record:update')
  @ApiOperation({ summary: 'update record by id' })
  public async updateRecord(
    @Param('tableId') tableId: string,
    @Param('id') id: string,
    @Body() { values }: UpdateRecordDTO,
  ) {
    await this.service.updateRecord(tableId, id, values)
  }

  @Version('1')
  @Patch('tables/:tableId/records/bulk')
  @Permissions('record:update')
  @ApiOperation({ summary: 'update records bulk' })
  public async updateRecords(@Param('tableId') tableId: string, @Body() { records }: UpdateRecordBulkDTO) {
    await this.service.updateRecords(tableId, records)
  }

  @Version('1')
  @Delete('tables/:tableId/records/:id')
  @Permissions('record:delete')
  @ApiOperation({ summary: 'delete record by id' })
  public async deleteRecord(@Param('tableId') tableId: string, @Param('id') id: string) {
    await this.commandBus.execute(new DeleteRecordCommand({ tableId, id }))
  }

  @Version('1')
  @Post('tables/:tableId/records/:id/restore')
  @Permissions('record:create')
  @ApiOperation({ summary: 'restore record by id' })
  public async restoreRecord(@Param('tableId') tableId: string, @Param('id') id: string) {
    await this.commandBus.execute(new RestoreRecordCommand({ tableId, id }))
  }

  @Version('1')
  @Delete('tables/:tableId/records')
  @Permissions('record:delete')
  @ApiOperation({ summary: 'delete records bulk' })
  public async deleteRecordsByIds(@Param('tableId') tableId: string, @Body() { ids }: DeleteRecordsBulkDTO) {
    await this.commandBus.execute(new BulkDeleteRecordsCommand({ tableId, ids }))
  }

  @Version('1')
  @Post('tables/:tableId/records/:id')
  @Permissions('record:create')
  @ApiOperation({ summary: 'duplicate record by id' })
  public async duplicateRecordById(@Param('tableId') tableId: string, @Param('id') id: string) {
    await this.commandBus.execute(new DuplicateRecordCommand({ tableId, id }))
  }

  @Version('1')
  @Post('tables/:tableId/records/duplicate/bulk')
  @Permissions('record:create')
  @ApiOperation({ summary: 'duplicate records by ids' })
  public async duplicateRecordsByIds(@Param('tableId') tableId: string, @Body() { ids }: DuplicateRecordsBulkDTO) {
    await this.commandBus.execute(new BulkDuplicateRecordsCommand({ tableId, ids }))
  }

  @Sse('tables/:tableId/subscription')
  @ApiTags(API_TAG_SUBSCRIPTION)
  @ApiOperation({ summary: 'subscribe record events' })
  subscription(@Param('tableId') tableId: string): Observable<MessageEvent> {
    return this.handler.observe(tableId).pipe(
      map((event) => ({ data: { event }, id: event.id })),
      tap((message) => this.logger.info('handling subscription event %s', message.data.event.name)),
    )
  }
}
