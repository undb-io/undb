import { recordEvents, tableId } from "@undb/table"
import { z } from "@undb/zod"
import { webhookHeadersSchema } from "../webhook-headers.vo"
import { webhookId } from "../webhook-id.vo"
import { webhookMethodSchema } from "../webhook-method.vo"
import { webhookURLSchema } from "../webhook-url.vo"
import { webhookConditionGroup } from "../webhook.condition"

export const webhookDTO = z.object({
  id: webhookId,
  name: z.string().min(1),
  url: webhookURLSchema,
  method: webhookMethodSchema,
  enabled: z.boolean(),
  tableId: tableId,
  headers: webhookHeadersSchema,
  condition: webhookConditionGroup.optional(),
  event: z.enum(recordEvents),
})

export type IWebhookDTO = z.infer<typeof webhookDTO>
