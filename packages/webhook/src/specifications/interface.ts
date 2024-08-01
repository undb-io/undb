import type { CompositeSpecification, ISpecVisitor } from "@undb/domain"
import type { WebhookDo } from "../webhook.js"
import type { WithWebhookCondition } from "./webhook-condition.specification.js"
import type { WithWebhookEnabled } from "./webhook-enabled.specification.js"
import type { WithWebhookHeaders } from "./webhook-headers.specification.js"
import type { WithWebhookId } from "./webhook-id.specification.js"
import type { WithWebhookMethod } from "./webhook-method.specification.js"
import type { WithWebhookName } from "./webhook-name.specification.js"
import type { WebhookEventsIn, WithWebhookEvent, WithWebhookTableId } from "./webhook-tableId.specification.js"
import type { WithWebhookURL } from "./webhook-url.specification.js"

export interface IWebhookSpecVisitor extends ISpecVisitor {
  idEqual(s: WithWebhookId): void
  nameEqual(s: WithWebhookName): void
  urlEqual(s: WithWebhookURL): void
  headersEqual(s: WithWebhookHeaders): void
  withTableId(s: WithWebhookTableId): void
  enabled(s: WithWebhookEnabled): void
  methodEqual(s: WithWebhookMethod): void
  eventEqual(s: WithWebhookEvent): void
  eventsIn(s: WebhookEventsIn): void
  conditionEqual(s: WithWebhookCondition): void
}

export type WebhookSpecification = CompositeSpecification<WebhookDo, IWebhookSpecVisitor>
