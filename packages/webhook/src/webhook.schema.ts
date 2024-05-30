import { z } from "zod"
import { webhookHeadersSchema } from "./webhook-headers.vo.js"
import { webhookId } from "./webhook-id.vo.js"
import { webhookMethodSchema } from "./webhook-method.vo.js"
import { webhookTargetSchema } from "./webhook-target.vo.js"
import { webhookURLSchema } from "./webhook-url.vo.js"
import { webhookConditionGroup } from "./webhook.condition.js"
import { recordEvents } from "@undb/table"

export const unsafeCreateWebhookSchema = z.object({
  id: webhookId,
  name: z.string().min(1),
  url: webhookURLSchema,
  method: webhookMethodSchema,
  enabled: z.boolean(),
  target: webhookTargetSchema,
  headers: webhookHeadersSchema,
  condition: webhookConditionGroup.optional(),
})

export const updateWebhookSchema = z
  .object({
    name: z.string().min(1),
    url: webhookURLSchema,
    method: webhookMethodSchema,
    enabled: z.boolean(),
    event: z.enum(recordEvents),
    headers: webhookHeadersSchema,
    condition: webhookConditionGroup,
  })
  .partial()

export type IUpdateWebhookSchema = z.infer<typeof updateWebhookSchema>

export const baseWebhookRecordEventSchema = z.object({
  id: z.string().uuid(),
  operatorId: z.string(),
  timestamp: z.date(),
})

export const webhookEventSchema = z
  .object({
    // TODO: schema
    event: z.any(),
  })
  .merge(baseWebhookRecordEventSchema)

export type IWebhookEventSchema = z.infer<typeof webhookEventSchema>
