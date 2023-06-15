import { events } from '@undb/core'
import { z } from 'zod'
import { webhookIdSchema } from './webhook-id.vo.js'
import { webhookMethodSchema } from './webhook-method.vo.js'
import { webhookTargetSchema } from './webhook-target.vo.js'
import { webhookURLSchema } from './webhook-url.vo.js'

export const queryWebhook = z
  .object({
    id: webhookIdSchema,
    name: z.string().nonempty(),
    url: webhookURLSchema,
    method: webhookMethodSchema,
    enabled: z.boolean(),
    target: webhookTargetSchema,
  })
  .strict()

export const unsafeCreateWebhookSchema = z.object({
  id: webhookIdSchema,
  name: z.string().nonempty(),
  url: webhookURLSchema,
  method: webhookMethodSchema,
  enabled: z.boolean(),
  target: webhookTargetSchema,
})

export const createWebhookSchema = z.object({
  id: webhookIdSchema.optional(),
  name: z.string().nonempty(),
  url: webhookURLSchema,
  method: webhookMethodSchema.default('POST'),
  enabled: z.boolean().default(true),
  target: webhookTargetSchema.unwrap().default({ id: '', type: 'table', event: 'record.created' }),
})

export type ICreateWebhookSchema = z.infer<typeof createWebhookSchema>

export const updateWebhookSchema = z
  .object({
    name: z.string().nonempty(),
    url: webhookURLSchema,
    method: webhookMethodSchema,
    enabled: z.boolean(),
    event: z.enum(events),
  })
  .partial()

export type IUpdateWebhookSchema = z.infer<typeof updateWebhookSchema>
