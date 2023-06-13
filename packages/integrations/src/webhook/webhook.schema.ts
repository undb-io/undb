import { z } from 'zod'
import { webhookIdSchema } from './webhook-id.vo'
import { webhookURLSchema } from './webhook-url.vo'

export const queryWebhook = z
  .object({
    id: webhookIdSchema,
    url: webhookURLSchema,
  })
  .strict()

export const unsafeCreateWebhookSchema = z.object({
  id: webhookIdSchema,
  url: webhookURLSchema,
})
