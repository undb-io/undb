import { z } from "@undb/zod"
import { webhookId } from "../webhook-id.vo"
import { webhookURLSchema } from "../webhook-url.vo"
import { webhookMethodSchema } from "../webhook-method.vo"
import { webhookTargetSchema } from "../webhook-target.vo"
import { webhookHeadersSchema } from "../webhook-headers.vo"
import { webhookConditionGroup } from "../webhook.condition"
import { recordEvents } from "@undb/table"

export const createWebhookDTO = z.object({
  id: webhookId.optional(),
  name: z.string().min(1),
  url: webhookURLSchema,
  method: webhookMethodSchema,
  enabled: z.boolean(),
  target: webhookTargetSchema.unwrap(),
  headers: webhookHeadersSchema,
  condition: webhookConditionGroup.optional(),
  event: z.enum(recordEvents),
})

export type ICreateWebhookDTO = z.infer<typeof createWebhookDTO>
