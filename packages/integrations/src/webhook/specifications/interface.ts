import type { CompositeSpecification } from '@undb/domain'
import type { Webhook } from '../webhook.js'
import type { WithWebhookEnabled } from './webhook-enabled.specification.js'
import type { WithWebhookFilter } from './webhook-filter.specification.js'
import type { WithWebhookHeaders } from './webhook-headers.specification.js'
import type { WithWebhookId } from './webhook-id.specification.js'
import type { WithWebhookMethod } from './webhook-method.specification.js'
import type { WithWebhookName } from './webhook-name.specification.js'
import type {
  WebhookEventsIn,
  WithWebhookEvent,
  WithWebhookTable,
  WithWebhookTarget,
} from './webhook-target.specification.js'
import type { WithWebhookURL } from './webhook-url.specification.js'

export interface IWebhookSpecVisitor {
  idEqual(s: WithWebhookId): void
  nameEqual(s: WithWebhookName): void
  urlEqual(s: WithWebhookURL): void
  headersEqual(s: WithWebhookHeaders): void
  targetEqual(s: WithWebhookTarget): void
  enabled(s: WithWebhookEnabled): void
  methodEqual(s: WithWebhookMethod): void
  targetTable(s: WithWebhookTable): void
  eventEqual(s: WithWebhookEvent): void
  eventsIn(s: WebhookEventsIn): void
  filterEqual(s: WithWebhookFilter): void

  or(left: WebhookSpecification, right: WebhookSpecification): IWebhookSpecVisitor
  not(): IWebhookSpecVisitor
}

export type WebhookSpecification = CompositeSpecification<Webhook, IWebhookSpecVisitor>
