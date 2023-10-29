import { Controller, Get, Param, UseGuards, Version } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import type { IGetTableOutput, IGetTablesOutput } from '@undb/cqrs'
import { GetTableQuery, GetTablesQuery } from '@undb/cqrs'
import { OpenApiGuard } from '../auth/open-api.guard.js'
import { AuthzGuard } from '../authz/authz.guard.js'
import { Permissions } from '../authz/rbac/permission.decorator.js'
import { API_TAG_TABLE } from './openapi.constants.js'

@Controller({
  path: 'openapi',
  version: '1',
})
@UseGuards(OpenApiGuard, AuthzGuard)
@ApiTags(API_TAG_TABLE)
@ApiBearerAuth()
@ApiForbiddenResponse()
export class OpenAPITableController {
  constructor(private readonly queryBus: QueryBus) {}

  @Version('1')
  @Get('tables')
  @ApiOperation({ summary: 'get all tables' })
  @Permissions('table:list')
  public async getTables() {
    const tables: IGetTablesOutput = await this.queryBus.execute(new GetTablesQuery({}))

    return { tables }
  }

  @Version('1')
  @Get('tables/:tableId')
  @ApiOperation({ summary: 'get table by id' })
  @Permissions('table:get')
  public async getTable(@Param('tableId') tableId: string) {
    const table: IGetTableOutput = await this.queryBus.execute(new GetTableQuery({ id: tableId }))

    return { table: table.table }
  }
}
