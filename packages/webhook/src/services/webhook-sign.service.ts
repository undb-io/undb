import type { IEvent } from "@undb/domain"
import type { Webhook } from "../webhook.js"
import { inject } from "@undb/di"

export interface IWebhookSignService {
  sign(webhook: Webhook, event: IEvent): string
}

export const WEBHOOK_SIGN_SERVICE = Symbol("WEBHOOK_SIGN_SERVICE")

export const injectWebhookSignService = () => inject(WEBHOOK_SIGN_SERVICE)
