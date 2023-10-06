import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { type Table } from '@undb/core'
import { webhookIdSchema } from '@undb/integrations'
import { z } from 'zod'
import { TAG_WEBHOOK_CRUD } from '../constants.js'
import type { IOpenAPIUpdateWebhookSchema } from '../schema/webhook.schema.js'

export const updateWebhook = (table: Table, schema: IOpenAPIUpdateWebhookSchema): RouteConfig => {
  return {
    method: 'patch',
    path: `/tables/${table.id.value}/webhooks/{id}`,
    description: `Update ${table.name.value} webhook`,
    summary: `Update ${table.name.value} webhook`,
    tags: [TAG_WEBHOOK_CRUD],
    request: {
      params: z.object({
        id: webhookIdSchema,
      }),
      body: {
        description: 'update webhook body',
        content: {
          'application/json': {
            schema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'update webhook success',
      },
    },
  }
}
