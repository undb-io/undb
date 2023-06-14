import type { CompositeSpecification } from '@undb/domain'
import type { Webhook } from '../webhook.js'
import type { WithWebhookEnabled } from './webhook-enabled.specification.js'
import type { WithWebhookId } from './webhook-id.specification.js'
import type { WithWebhookTarget } from './webhook-target.specification.js'
import type { WithWebhookURL } from './webhook-url.specification.js'

export interface IWebhookSpecVisitor {
  idEqual(s: WithWebhookId): void
  urlEqual(s: WithWebhookURL): void
  targetEqual(s: WithWebhookTarget): void
  enabled(s: WithWebhookEnabled): void

  or(left: WebhookSpecification, right: WebhookSpecification): IWebhookSpecVisitor
  not(): IWebhookSpecVisitor
}

export type WebhookSpecification = CompositeSpecification<Webhook, IWebhookSpecVisitor>
