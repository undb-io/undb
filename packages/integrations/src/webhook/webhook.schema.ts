import { EVT_RECORD_CREATED, events, recordEvents, rootFilter, userIdSchema } from '@undb/core'
import { z } from 'zod'
import { webhookHeadersSchema } from './webhook-headers.vo.js'
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
    headers: webhookHeadersSchema,
    filter: rootFilter.optional(),
  })
  .strict()

export const unsafeCreateWebhookSchema = z.object({
  id: webhookIdSchema,
  name: z.string().nonempty(),
  url: webhookURLSchema,
  method: webhookMethodSchema,
  enabled: z.boolean(),
  target: webhookTargetSchema,
  headers: webhookHeadersSchema,
  filter: rootFilter.optional(),
})

export const createWebhookSchema = z.object({
  id: webhookIdSchema.optional(),
  name: z.string().nonempty(),
  url: webhookURLSchema,
  method: webhookMethodSchema.default('POST'),
  enabled: z.boolean().default(true),
  target: webhookTargetSchema.unwrap().default({ id: '', type: 'table', event: EVT_RECORD_CREATED }),
  headers: webhookHeadersSchema.default({}),
  filter: rootFilter.optional().default([]),
  event: z.enum(recordEvents),
})

export type ICreateWebhookSchema = z.infer<typeof createWebhookSchema>

export const updateWebhookSchema = z
  .object({
    name: z.string().nonempty(),
    url: webhookURLSchema,
    method: webhookMethodSchema,
    enabled: z.boolean(),
    event: z.enum(events),
    headers: webhookHeadersSchema,
    filter: rootFilter,
  })
  .partial()

export type IUpdateWebhookSchema = z.infer<typeof updateWebhookSchema>

export const baseWebhookRecordEventSchema = z.object({
  id: z.string().uuid(),
  operatorId: userIdSchema,
  timestamp: z.date(),
})

export const webhookEventSchema = z
  .object({
    // TODO: schema
    event: z.any(),
  })
  .merge(baseWebhookRecordEventSchema)

export type IWebhookEventSchema = z.infer<typeof webhookEventSchema>
