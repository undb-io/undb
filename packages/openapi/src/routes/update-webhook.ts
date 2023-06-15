import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { type Table } from '@undb/core'
import { WebhookId, webhookIdSchema } from '@undb/integrations'
import { z } from 'zod'
import { COMPONENT_WEBHOOK_ID, TAG_WEBHOOK } from '../constants.js'
import { IOpenAPIUpdateWebhookSchema } from '../schema/webhook.schema.js'

export const updateWebhook = (table: Table, schema: IOpenAPIUpdateWebhookSchema): RouteConfig => {
  return {
    method: 'patch',
    path: `/tables/${table.id.value}/webhooks`,
    description: `Update ${table.name.value} webhook`,
    summary: `Update ${table.name.value} webhook`,
    tags: [TAG_WEBHOOK],
    request: {
      body: {
        description: 'update webhook body',
        content: {
          'application/json': {
            schema: z.object({
              id: webhookIdSchema.openapi(COMPONENT_WEBHOOK_ID, { example: WebhookId.createId() }),
              values: schema,
            }),
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
