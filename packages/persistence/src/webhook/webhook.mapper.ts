import { injectContext, type IContext } from "@undb/context"
import { singleton } from "@undb/di"
import type { Mapper } from "@undb/domain"
import { WebhookDo, WebhookFactory, type IWebhookDTO } from "@undb/webhook"
import type { Webhook } from "../db"
import { json } from "../qb.util"

@singleton()
export class WebhookMapper implements Mapper<WebhookDo, Webhook, IWebhookDTO> {
  constructor(
    @injectContext()
    private readonly context: IContext,
  ) {}
  toDo(entity: Webhook): WebhookDo {
    return WebhookFactory.fromJSON({
      id: entity.id,
      name: entity.name,
      url: entity.url,
      tableId: entity.table_id,
      headers: entity.headers,
      enabled: entity.enabled,
      method: entity.method,
      condition: entity.condition ?? undefined,
      event: entity.event,
    })
  }
  toDTO(entity: Webhook): IWebhookDTO {
    return {
      id: entity.id,
      name: entity.name,
      url: entity.url,
      tableId: entity.table_id,
      headers: entity.headers,
      enabled: !!entity.enabled,
      method: entity.method,
      condition: entity.condition ?? undefined,
      event: entity.event,
    }
  }
  toEntity(domain: WebhookDo): Webhook {
    const data = domain.toJSON()
    return {
      id: data.id,
      name: data.name,
      url: data.url,
      table_id: data.tableId,
      headers: json(data.headers),
      enabled: data.enabled,
      method: data.method,
      condition: data.condition ? json(data.condition) : null,
      event: data.event,
      space_id: this.context.mustGetCurrentSpaceId(),
    }
  }
}
