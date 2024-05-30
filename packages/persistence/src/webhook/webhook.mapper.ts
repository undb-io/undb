import type { Mapper } from "@undb/domain"
import type { NewWebhook, Webhook } from "../tables"
import { WebhookDo, type IWebhookDTO } from "@undb/webhook"
import { singleton } from "@undb/di"
import type { IConditionGroup } from "@undb/table"
import type { ZodUndefined } from "zod"

@singleton()
export class WebhookMapper implements Mapper<WebhookDo, Webhook, IWebhookDTO> {
  toDo(entity: Webhook): WebhookDo {
    throw new Error("Method not implemented.")
  }
  toDTO(entity: Webhook): IWebhookDTO {
    return {
      id: entity.id,
      name: entity.name,
      url: entity.url,
      headers: entity.headers,
      target: entity.target,
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
