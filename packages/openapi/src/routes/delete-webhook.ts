import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { type Table } from '@undb/core'
import { WebhookId, webhookIdSchema } from '@undb/integrations'
import { z } from 'zod'
import { TAG_WEBHOOK_CRUD } from '../constants.js'

export const deleteWebhook = (table: Table): RouteConfig => {
  return {
    method: 'delete',
    path: `/tables/${table.id.value}/webhooks/:id`,
    description: `Delete ${table.name.value} webhook`,
    summary: `Delete ${table.name.value} webhook`,
    tags: [TAG_WEBHOOK_CRUD],
    request: {
      params: z.object({
        id: webhookIdSchema.openapi({ example: WebhookId.createId() }),
      }),
    },
    responses: {
      200: {
        description: 'delete webhook success',
      },
    },
  }
}
