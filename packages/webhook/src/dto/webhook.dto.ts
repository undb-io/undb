import { z } from "@undb/zod"
import { webhookId } from "../webhook-id.vo"
import { webhookURLSchema } from "../webhook-url.vo"
import { webhookMethodSchema } from "../webhook-method.vo"
import { webhookTargetSchema } from "../webhook-target.vo"
import { webhookHeadersSchema } from "../webhook-headers.vo"
import { webhookConditionGroup } from "../webhook.condition"
import { webhookEventSchema } from "../webhook.schema"

export const webhookDTO = z.object({
  id: webhookId,
  name: z.string().min(1),
  url: webhookURLSchema,
  method: webhookMethodSchema,
  enabled: z.boolean(),
  target: webhookTargetSchema,
  headers: webhookHeadersSchema,
  condition: webhookConditionGroup.optional(),
  event: webhookEventSchema,
})

export type IWebhookDTO = z.infer<typeof webhookDTO>
