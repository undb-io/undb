import { Body, Controller, Delete, Param, Patch, Post, UseGuards, Version } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import {
  BulkDeleteRecordsCommand,
  BulkDuplicateRecordsCommand,
  DeleteRecordCommand,
  DuplicateRecordCommand,
} from '@undb/cqrs'
import type { IOpenAPIMutateRecordSchema } from '@undb/openapi'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { OpenAPIRecordService } from './openapi-record.service.js'

@Controller({
  path: 'openapi',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class OpenAPIWebhookController {
  constructor(
    private queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly service: OpenAPIRecordService,
  ) {}

  @Version('1')
  @Post('tables/:tableId/webhooks')
  public async createWebhook(
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
}
