import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Version } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiTags } from '@nestjs/swagger'
import { DeleteWebhookCommand, GetWebhooksQuery } from '@undb/cqrs'
import { type IOpenAPICreateWebhook, type IOpenAPIUpdateWebhook } from '@undb/openapi'
import { OpenApiGuard } from '../auth/open-api.guard.js'
import { AuthzGuard } from '../authz/authz.guard.js'
import { Permissions } from '../authz/rbac/permission.decorator.js'
import { OpenAPIWebhookService } from './openapi-webhook.service.js'
import { API_TAG_WEBHOOK } from './openapi.constants.js'

@Controller({
  path: 'openapi',
  version: '1',
})
@ApiTags(API_TAG_WEBHOOK)
@UseGuards(OpenApiGuard, AuthzGuard)
export class OpenAPIWebhookController {
  constructor(
    private readonly service: OpenAPIWebhookService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Version('1')
  @Post('tables/:tableId/webhooks')
  @Permissions('webhook:create')
  public async createWebhook(@Param('tableId') tableId: string, @Body('values') values: IOpenAPICreateWebhook) {
    await this.service.createWebhook(tableId, values)
  }

  @Version('1')
  @Patch('tables/:tableId/webhooks')
  @Permissions('webhook:update')
  public async updateWebhook(
    @Param('tableId') tableId: string,
    @Param('id') id: string,
    @Body('values') values: IOpenAPIUpdateWebhook,
  ) {
    await this.service.updateWebhook(tableId, id, values)
  }

  @Version('1')
  @Delete('tables/:tableId/webhooks/:id')
  @Permissions('webhook:create')
  public async deleteWebhook(@Param('tableId') tableId: string, @Param('id') id: string) {
    const cmd = new DeleteWebhookCommand({ webhookId: id })
    await this.commandBus.execute(cmd)
  }

  @Version('1')
  @Get('tables/:tableId/webhooks')
  public async getWebhooks(@Param('tableId') tableId: string) {
    const query = new GetWebhooksQuery({ tableId })
    await this.queryBus.execute(query)
  }
}
