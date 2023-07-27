import { EVT_RECORD_CREATED, Table, recordEvents, rootFilter } from '@undb/core'
import {
  WebhookId,
  webhookHeadersSchema,
  webhookIdSchema,
  webhookMethodSchema,
  webhookURLSchema,
} from '@undb/integrations'
import { z } from 'zod'

export const createCreateWebhookSchema = (table: Table) => {
  const schema = z.object({
    id: webhookIdSchema.openapi({ example: WebhookId.createId() }),
    enabled: z.boolean().openapi({ example: true }),
    method: webhookMethodSchema.openapi({ example: 'POST' }),
    name: z.string().openapi({ example: 'your awesome webhook' }),
    url: webhookURLSchema.openapi({ example: 'https://yourdomain.com/webhook' }),
    event: z.enum(recordEvents).openapi({ example: EVT_RECORD_CREATED }),
    headers: webhookHeadersSchema.openapi({ example: {} }),
    filter: rootFilter.openapi({}),
  })

  return schema
}

export type IOpenAPICreateWebhookSchema = ReturnType<typeof createCreateWebhookSchema>

export type IOpenAPICreateWebhook = z.infer<IOpenAPICreateWebhookSchema>

export const createUpdateWebhookSchema = (table: Table) => {
  const schema = z
    .object({
      enabled: z.boolean().openapi({ example: true }),
      method: webhookMethodSchema.openapi({ example: 'POST' }),
      name: z.string().openapi({ example: 'your awesome webhook' }),
      url: webhookURLSchema.openapi({ example: 'https://yourdomain.com/webhook' }),
      event: z.enum(recordEvents).openapi({ example: EVT_RECORD_CREATED }),
    })
    .partial()

  return schema
}

export type IOpenAPIUpdateWebhookSchema = ReturnType<typeof createUpdateWebhookSchema>

export type IOpenAPIUpdateWebhook = z.infer<IOpenAPIUpdateWebhookSchema>
