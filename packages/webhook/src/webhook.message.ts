import { z } from "@undb/zod"
import { webhookHeadersSchema } from "./webhook-headers.vo"

const webhookMessageBody = z.object({
  id: z.string().uuid(),
  operatorId: z.string(),
  timestamp: z.date(),
  // TODO: type
  event: z.any(),
})

export type IWebhookMessageBody = z.infer<typeof webhookMessageBody>

export const webhookMessage = z.object({
  headers: webhookHeadersSchema,
  body: webhookMessageBody,
})

export type IWebhookMessage = z.infer<typeof webhookMessage>
