import type { z } from 'zod'
import type { updateWebhookCommandInput } from './update-webhook.command.input.js'

export type IUpdateWebhookCommandInput = z.infer<typeof updateWebhookCommandInput>
