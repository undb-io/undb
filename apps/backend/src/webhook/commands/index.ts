import { NestCreateWebhookCommandHandler } from './create-webhook.command-handler.js'
import { NestDeleteWebhookCommandHandler } from './delete-webhook.command-handler.js'
import { NestUpdateWebhookCommandHandler } from './update-webhook.command-handler.js'

export const commands = [
  NestCreateWebhookCommandHandler,
  NestDeleteWebhookCommandHandler,
  NestUpdateWebhookCommandHandler,
]
