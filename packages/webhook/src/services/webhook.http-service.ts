import { inject } from "@undb/di"
import type { IWebhookMessage } from "../webhook.message.js"

export interface IWebhookHttpService {
  send(mesasge: IWebhookMessage): Promise<void>
}

export const WEBHOOK_HTTP_SERVICE = Symbol("WEBHOOK_HTTP_SERVICE")

export const injectWebhookHttpService = () => inject(WEBHOOK_HTTP_SERVICE)
