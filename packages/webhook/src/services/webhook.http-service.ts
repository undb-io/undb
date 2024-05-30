import type { IEvent } from "@undb/domain"
import type { WebhookDo } from "../webhook.js"
import { inject } from "@undb/di"

export interface IWebhookHttpService {
  send(webhook: WebhookDo, event: IEvent): Promise<void>
}

export const WEBHOOK_HTTP_SERVICE = Symbol("WEBHOOK_HTTP_SERVICE")

export const injectWebhookHttpService = () => inject(WEBHOOK_HTTP_SERVICE)
