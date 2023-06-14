import type { z } from 'zod'
import type { createWebhookCommandInput } from './create-webhook.command.input.js'

export type ICreateWebhookCommandInput = z.infer<typeof createWebhookCommandInput>
