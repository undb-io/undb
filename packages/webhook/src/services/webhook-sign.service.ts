import { inject } from "@undb/di"
import type { IWebhookMessageBody } from "../webhook.message.js"

export interface IWebhookSignService {
  sign(body: IWebhookMessageBody): string
}

export const WEBHOOK_SIGN_SERVICE = Symbol("WEBHOOK_SIGN_SERVICE")

export const injectWebhookSignService = () => inject(WEBHOOK_SIGN_SERVICE)
