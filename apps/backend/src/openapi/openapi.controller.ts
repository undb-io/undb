import { Body, Controller, Delete, Get, Param, Query, UseGuards, Version } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { BulkDeleteRecordsCommand, DeleteRecordCommand, GetRecordQuery, GetRecordsQuery } from '@undb/cqrs'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { OpenAPIService } from './openapi.service.js'

@Controller({
  path: 'openapi',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class OpenAPIController {
  constructor(
    private queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly service: OpenAPIService,
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
  @Delete('tables/:tableId/records/:id')
  public async deleteRecord(@Param('tableId') tableId: string, @Param('id') id: string) {
    await this.commandBus.execute(new DeleteRecordCommand({ tableId, id }))
  }

  @Version('1')
  @Delete('tables/:tableId/records')
  public async deleteRecordsByIds(@Param('tableId') tableId: string, @Body('ids') ids: [string, ...string[]]) {
    await this.commandBus.execute(new BulkDeleteRecordsCommand({ tableId, ids }))
  }
}
