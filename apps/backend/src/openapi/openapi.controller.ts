import { Controller, Get, Param, UseGuards, Version } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { GetRecordsQuery } from '@undb/cqrs'
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
  public async getRecords(@Param('tableId') tableId: string) {
    const data = await this.queryBus.execute(new GetRecordsQuery({ tableId }))
    return { data }
  }
}
