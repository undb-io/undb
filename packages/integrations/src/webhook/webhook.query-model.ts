import type { Option } from 'oxide.ts'
import type { WebhookSpecification } from './specifications'
import type { IQueryWebhook } from './webhook.type'

export interface IWebhookQueryModel {
  findOneById: (id: string) => Promise<Option<IQueryWebhook>>
  findOne: (spec: WebhookSpecification) => Promise<Option<IQueryWebhook>>
  find: (spec: WebhookSpecification | null) => Promise<IQueryWebhook[]>
}
