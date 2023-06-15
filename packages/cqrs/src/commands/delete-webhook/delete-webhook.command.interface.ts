import type { z } from 'zod'
import type { deleteWebhookCommandInput } from './delete-webhook.command.input.js'

export type IDeleteWebhookCommandInput = z.infer<typeof deleteWebhookCommandInput>
