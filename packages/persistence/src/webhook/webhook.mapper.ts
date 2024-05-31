import { singleton } from "@undb/di"
import type { Mapper } from "@undb/domain"
import { WebhookDo, WebhookFactory, type IWebhookDTO } from "@undb/webhook"
import type { NewWebhook, Webhook } from "../tables"

@singleton()
export class WebhookMapper implements Mapper<WebhookDo, Webhook, IWebhookDTO> {
  toDo(entity: Webhook): WebhookDo {
    return WebhookFactory.fromJSON(entity)
  }
  toDTO(entity: Webhook): IWebhookDTO {
    return {
      id: entity.id,
      name: entity.name,
      url: entity.url,
      tableId: entity.tableId,
      headers: entity.headers,
      enabled: entity.enabled,
      method: entity.method,
      condition: entity.condition ?? undefined,
      event: entity.event,
    }
  }
  toEntity(domain: WebhookDo): NewWebhook {
    return domain.toJSON()
  }
}
