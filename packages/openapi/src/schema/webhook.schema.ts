import { Table, recordEvents } from '@undb/core'
import { WebhookId, webhookIdSchema, webhookMethodSchema, webhookURLSchema } from '@undb/integrations'
import { z } from 'zod'

export const createCreateWebhookSchema = (table: Table) => {
  const schema = z.object({
    id: webhookIdSchema.openapi({ example: WebhookId.createId() }),
    enabled: z.boolean().openapi({ example: true }),
    method: webhookMethodSchema.openapi({ example: 'POST' }),
    name: z.string().openapi({ example: 'your awesome webhook' }),
    url: webhookURLSchema.openapi({ example: 'https://yourdomain.com/webhook' }),
    event: z.enum(recordEvents).openapi({ example: 'record.created' }),
  })

  return schema
}

export type IOpenAPICreateWebhookSchema = ReturnType<typeof createCreateWebhookSchema>

export type IOpenAPICreateWebhook = z.infer<IOpenAPICreateWebhookSchema>
