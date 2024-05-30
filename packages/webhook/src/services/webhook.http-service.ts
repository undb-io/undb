import type { IEvent } from "@undb/domain"
import type { Webhook } from "../webhook.js"
import { inject } from "@undb/di"

export interface IWebhookHttpService {
  send(webhook: Webhook, event: IEvent): Promise<void>
}

export const WEBHOOK_HTTP_SERVICE = Symbol("WEBHOOK_HTTP_SERVICE")

export const injectWebhookHttpService = () => inject(WEBHOOK_HTTP_SERVICE)
