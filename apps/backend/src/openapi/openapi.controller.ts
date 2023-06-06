import { Controller, Get, Param, Version } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { GetRecordsQuery } from '@undb/cqrs'

@Controller({
  path: 'openapi',
  version: '1',
})
export class OpenAPIController {
  constructor(private queryBus: QueryBus) {}

  @Version('1')
  @Get('tables/:tableId/records')
  public async getRecords(@Param('tableId') tableId: string) {
    const data = await this.queryBus.execute(new GetRecordsQuery({ tableId }))
    return { data }
  }
}
