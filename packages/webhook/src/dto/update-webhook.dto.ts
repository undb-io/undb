import { recordEvents } from "@undb/table"
import { z } from "zod"
import { webhookHeadersSchema } from "../webhook-headers.vo.js"
import { webhookMethodSchema } from "../webhook-method.vo.js"
import { webhookURLSchema } from "../webhook-url.vo.js"
import { webhookConditionGroup } from "../webhook.condition.js"

export const updateWebhookDTO = z
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

export type IUpdateWebhookDTO = z.infer<typeof updateWebhookDTO>
