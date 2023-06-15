import type { Option } from 'oxide.ts'
import type { WebhookSpecification } from './specifications/interface.js'
import type { Webhook } from './webhook.js'

export interface IWebhookRepository {
  insert(webhook: Webhook): Promise<void>
  updateOneById(id: string, spec: WebhookSpecification): Promise<void>
  findOneById(id: string): Promise<Option<Webhook>>
  findOne(spec: WebhookSpecification): Promise<Option<Webhook>>
  find(spec: WebhookSpecification): Promise<Webhook[]>
  deleteOneById(id: string): Promise<void>
}
