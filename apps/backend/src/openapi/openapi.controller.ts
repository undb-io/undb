import { Controller, Get, Param, Query, UseGuards, Version } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { GetRecordQuery, GetRecordsQuery } from '@undb/cqrs'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'

@Controller({
  path: 'openapi',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class OpenAPIController {
  constructor(private queryBus: QueryBus) {}

  @Version('1')
  @Get('tables/:tableId/records')
  public async getRecords(@Param('tableId') tableId: string, @Query('viewId') viewId?: string) {
    const data = await this.queryBus.execute(new GetRecordsQuery({ tableId, viewId }))
    return { data }
  }

  @Version('1')
  @Get('tables/:tableId/records/:id')
  public async getRecordById(@Param('tableId') tableId: string, @Param('id') id: string) {
    const data = await this.queryBus.execute(new GetRecordQuery({ tableId, id }))
    return { data }
  }
}
