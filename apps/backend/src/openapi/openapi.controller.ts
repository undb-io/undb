import { Controller, Get, Param, Query, UseGuards, Version } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { GetRecordQuery, GetRecordsQuery } from '@undb/cqrs'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { OpenAPIService } from './openapi.service.js'

@Controller({
  path: 'openapi',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class OpenAPIController {
  constructor(private queryBus: QueryBus, private readonly service: OpenAPIService) {}

  @Version('1')
  @Get('tables/:tableId/records')
  public async getRecords(@Param('tableId') tableId: string, @Query('viewId') viewId?: string) {
    const result = await this.queryBus.execute(new GetRecordsQuery({ tableId, viewId }))
    const data = await this.service.mapMany(tableId, result.records ?? [])
    return { data }
  }

  @Version('1')
  @Get('tables/:tableId/records/:id')
  public async getRecordById(@Param('tableId') tableId: string, @Param('id') id: string) {
    const result = await this.queryBus.execute(new GetRecordQuery({ tableId, id }))
    const data = result ? await this.service.mapMany(tableId, result) : null
    return { data }
  }
}
