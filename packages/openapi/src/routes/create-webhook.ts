import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { type Table } from '@undb/core'
import { TAG_WEBHOOK_CRUD } from '../constants.js'
import type { IOpenAPICreateWebhookSchema } from '../schema/webhook.schema.js'

export const createWebhook = (table: Table, schema: IOpenAPICreateWebhookSchema): RouteConfig => {
  return {
    method: 'post',
    path: `/tables/${table.id.value}/webhooks`,
    description: `Create ${table.name.value} webhook`,
    summary: `Create ${table.name.value} webhook`,
    tags: [TAG_WEBHOOK_CRUD],
    request: {
      body: {
        description: 'create webhook body',
        content: {
          'application/json': {
            schema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'create webhook success',
      },
    },
  }
}
