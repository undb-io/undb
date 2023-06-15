import { NestCreateWebhookCommandHandler } from './create-webhook.command-handler.js'
import { NestDeleteWebhookCommandHandler } from './delete-webhook.command-handler.js'

export const commands = [NestCreateWebhookCommandHandler, NestDeleteWebhookCommandHandler]
