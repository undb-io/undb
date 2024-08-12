import { z } from "@undb/zod"
import { webhookId } from "../webhook-id.vo"

export const deleteWebhookDTO = z.object({
  id: webhookId,
})

export type IDeleteWebhookDTO = z.infer<typeof deleteWebhookDTO>
