import { Injectable } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { CreateWebhookCommand } from '@undb/cqrs'
import { IOpenAPICreateWebhook } from '@undb/openapi'

@Injectable()
export class OpenAPIWebhookService {
  constructor(private readonly commandBus: CommandBus) {}

  public async createWebhook(tableId: string, values: IOpenAPICreateWebhook) {
    await this.commandBus.execute(
      new CreateWebhookCommand({
        tableId,
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
}
