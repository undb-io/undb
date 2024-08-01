import { and } from "@undb/domain"
import type { ICreateWebhookSchema } from "../dto/update-webhook.dto.js"
import type { WebhookSpecification } from "./interface.js"
import { WithWebhookCondition } from "./webhook-condition.specification.js"
import { WithWebhookEnabled } from "./webhook-enabled.specification.js"
import { WithWebhookHeaders } from "./webhook-headers.specification.js"
import { WithWebhookId } from "./webhook-id.specification.js"
import { WithWebhookMethod } from "./webhook-method.specification.js"
import { WithWebhookName } from "./webhook-name.specification.js"
import { WithWebhookTableId } from "./webhook-tableId.specification.js"
import { WithWebhookURL } from "./webhook-url.specification.js"

export * from "./interface.js"
export * from "./webhook-condition.specification.js"
export * from "./webhook-enabled.specification.js"
export * from "./webhook-headers.specification.js"
export * from "./webhook-id.specification.js"
export * from "./webhook-method.specification.js"
export * from "./webhook-name.specification.js"
export * from "./webhook-tableId.specification.js"
export * from "./webhook-url.specification.js"

export const newWebhookSpec = (input: ICreateWebhookSchema): WebhookSpecification => {
  return and(
    WithWebhookId.fromNullableString(input.id),
    WithWebhookTableId.from(input.target),
    new WithWebhookEnabled(input.enabled),
    WithWebhookMethod.fromString(input.method),
    WithWebhookURL.fromString(input.url),
    new WithWebhookName(input.name),
    WithWebhookHeaders.from(input.headers),
    new WithWebhookCondition(input.condition ?? null),
  ).unwrap()
}
