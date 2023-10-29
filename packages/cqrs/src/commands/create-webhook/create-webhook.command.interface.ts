import type { z } from 'zod'
import type { createWebhookCommandInput } from './create-webhook.command.input.js'
import type { createWebhookCommandOutput } from './create-webhook.command.output.js'

export type ICreateWebhookCommandInput = z.infer<typeof createWebhookCommandInput>
export type ICreateWebhookCommandOutput = z.infer<typeof createWebhookCommandOutput>
