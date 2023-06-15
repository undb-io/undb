import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { type Table } from '@undb/core'
import { z } from 'zod'
import { TAG_WEBHOOK } from '../constants.js'
import { IOpenAPICreateWebhookSchema } from '../schema/webhook.schema.js'

export const createWebhook = (table: Table, schema: IOpenAPICreateWebhookSchema): RouteConfig => {
  return {
    method: 'post',
    path: `/tables/${table.id.value}/webhooks`,
    description: `Create ${table.name.value} webhook`,
    summary: `Create ${table.name.value} webhook`,
    tags: [TAG_WEBHOOK],
    request: {
      body: {
        description: 'create webhook body',
        content: {
          'application/json': {
            schema: z.object({
              values: schema,
            }),
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
