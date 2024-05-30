import type { Option } from "oxide.ts"
import type { WebhookSpecification } from "./specifications"
import type { Webhook } from "./webhook.js"
import { inject } from "@undb/di"

export interface IWebhookRepository {
  insert(webhook: Webhook): Promise<void>
  updateOneById(id: string, spec: WebhookSpecification): Promise<void>
  findOneById(id: string): Promise<Option<Webhook>>
  findOne(spec: WebhookSpecification): Promise<Option<Webhook>>
  find(spec: WebhookSpecification): Promise<Webhook[]>
  deleteOneById(id: string): Promise<void>
}

export const WEBHOOK_REPOSITORY = Symbol("WEBHOOK_REPOSITORY")

export const injectWebhookRepository = () => inject(WEBHOOK_REPOSITORY)
