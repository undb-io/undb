import type { IEvent } from "@undb/domain"
import type { WebhookDo } from "../webhook.js"
import { inject } from "@undb/di"

export interface IWebhookSignService {
  sign(webhook: WebhookDo, event: IEvent): string
}

export const WEBHOOK_SIGN_SERVICE = Symbol("WEBHOOK_SIGN_SERVICE")

export const injectWebhookSignService = () => inject(WEBHOOK_SIGN_SERVICE)
