import { and } from "@undb/domain"
import { TableIdVo } from "@undb/table"
import type { IWebhookDTO } from "./dto/webhook.dto.js"
import type { WebhookSpecification } from "./specifications"
import {
  WithWebhookCondition,
  WithWebhookEnabled,
  WithWebhookEvent,
  WithWebhookHeaders,
  WithWebhookId,
  WithWebhookMethod,
  WithWebhookName,
  WithWebhookTableId,
  WithWebhookURL,
} from "./specifications"
import { WebhookDo } from "./webhook.js"

export class WebhookFactory {
  static create(...specs: WebhookSpecification[]): WebhookDo {
    return and(...specs)
      .unwrap()
      .mutate(WebhookDo.empty())
      .unwrap()
  }

  static fromJSON(input: IWebhookDTO): WebhookDo {
    return this.create(
      WithWebhookId.fromString(input.id),
      WithWebhookURL.fromString(input.url),
      new WithWebhookTableId(new TableIdVo(input.tableId)),
      new WithWebhookEnabled(input.enabled),
      WithWebhookMethod.fromString(input.method),
      new WithWebhookName(input.name),
      WithWebhookHeaders.from(input.headers),
      new WithWebhookEvent(input.event),
      new WithWebhookCondition(input.condition),
    )
  }
}
