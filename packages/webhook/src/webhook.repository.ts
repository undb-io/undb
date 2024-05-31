import { inject } from "@undb/di"
import type { IPagination } from "@undb/domain"
import type { Option } from "oxide.ts"
import type { IWebhookDTO } from "./dto/webhook.dto.js"
import type { WebhookSpecification } from "./specifications"
import type { WebhookDo } from "./webhook.js"

export interface IWebhookRepository {
  findOneById(id: string): Promise<Option<WebhookDo>>
  findOne(spec: WebhookSpecification): Promise<Option<WebhookDo>>
  find(spec: WebhookSpecification): Promise<WebhookDo[]>

  insert(webhook: WebhookDo): Promise<void>
  updateOneById(webhook: WebhookDo, spec: WebhookSpecification): Promise<void>
  deleteOneById(id: string): Promise<void>
}

export const WEBHOOK_REPOSITORY = Symbol("WEBHOOK_REPOSITORY")

export const injectWebhookRepository = () => inject(WEBHOOK_REPOSITORY)

export interface IWebhookQueryRepository {
  findOneById: (id: string) => Promise<Option<IWebhookDTO>>
  find: (spec: Option<WebhookSpecification>, pagination: Option<IPagination>) => Promise<IWebhookDTO[]>
}

export const WEBHOOK_QUERY_REPOSITORY = Symbol("WEBHOOK_QUERY_REPOSITORY")

export const injectWebhookQueryRepository = () => inject(WEBHOOK_QUERY_REPOSITORY)
