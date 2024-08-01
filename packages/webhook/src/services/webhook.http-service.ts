import { inject } from "@undb/di"
import type { WebhookDo } from "../webhook.js"
import type { IWebhookMessage } from "../webhook.message.js"

export interface IWebhookHttpService {
  send(webhook: WebhookDo, mesasge: IWebhookMessage): Promise<void>
}

export const WEBHOOK_HTTP_SERVICE = Symbol("WEBHOOK_HTTP_SERVICE")

export const injectWebhookHttpService = () => inject(WEBHOOK_HTTP_SERVICE)
