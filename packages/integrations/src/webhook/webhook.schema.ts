import { z } from 'zod'
import { webhookIdSchema } from './webhook-id.vo.js'
import { webhookMethodSchema } from './webhook-method.vo.js'
import { webhookTargetSchema } from './webhook-target.vo.js'
import { webhookURLSchema } from './webhook-url.vo.js'

export const queryWebhook = z
  .object({
    id: webhookIdSchema,
    url: webhookURLSchema,
    method: webhookMethodSchema,
    enabled: z.boolean(),
    target: webhookTargetSchema,
  })
  .strict()

export const unsafeCreateWebhookSchema = z.object({
  id: webhookIdSchema,
  url: webhookURLSchema,
  method: webhookMethodSchema,
  enabled: z.boolean(),
  target: webhookTargetSchema,
})

export const createWebhookSchema = z.object({
  id: webhookIdSchema.optional(),
  url: webhookURLSchema,
  method: webhookMethodSchema.default('POST'),
  enabled: z.boolean().default(true),
  target: webhookTargetSchema,
})

export type ICreateWebhookSchema = z.infer<typeof createWebhookSchema>
