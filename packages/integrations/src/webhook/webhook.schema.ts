import { z } from 'zod'
import { webhookIdSchema } from './webhook-id.vo.js'
import { webhookTargetSchema } from './webhook-target.vo.js'
import { webhookURLSchema } from './webhook-url.vo.js'

export const queryWebhook = z
  .object({
    id: webhookIdSchema,
    url: webhookURLSchema,
    target: webhookTargetSchema,
    enabled: z.boolean(),
  })
  .strict()

export const unsafeCreateWebhookSchema = z.object({
  id: webhookIdSchema,
  url: webhookURLSchema,
  target: webhookTargetSchema,
  enabled: z.boolean(),
})
