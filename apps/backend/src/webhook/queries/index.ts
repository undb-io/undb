import { NestGetWebhookByIdQueryHandler } from './get-webhook-by-id.query-handler.js'
import { NestGetWebhooksQueryHandler } from './get-webhooks.query-handler.js'

export const queries = [NestGetWebhooksQueryHandler, NestGetWebhookByIdQueryHandler]
