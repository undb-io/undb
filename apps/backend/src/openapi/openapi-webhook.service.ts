import { Injectable } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { CreateWebhookCommand, UpdateWebhookCommand } from '@undb/cqrs'
import type { IOpenAPICreateWebhook, IOpenAPIUpdateWebhook } from '@undb/openapi'

@Injectable()
export class OpenAPIWebhookService {
  constructor(private readonly commandBus: CommandBus) {}

  public async createWebhook(tableId: string, values: IOpenAPICreateWebhook) {
    return this.commandBus.execute(
      new CreateWebhookCommand({
        tableId,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        webhook: {
          ...values,
          target: {
            id: tableId,
            type: 'table',
            event: values.event,
          },
        },
      }),
    )
  }

  public async updateWebhook(tableId: string, id: string, values: IOpenAPIUpdateWebhook) {
    await this.commandBus.execute(
      new UpdateWebhookCommand({
        tableId,
        webhookId: id,
        webhook: {
          ...values,
        },
      }),
    )
  }
}
