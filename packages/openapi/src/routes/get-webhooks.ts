import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { type Table } from '@undb/core'
import { queryWebhook } from '@undb/integrations'
import { z } from 'zod'
import { TAG_WEBHOOK_CRUD } from '../constants.js'

export const getWebhooks = (table: Table): RouteConfig => {
  return {
    method: 'get',
    path: `/tables/${table.id.value}/webhooks`,
    description: `Get ${table.name.value} webhooks`,
    summary: `Get ${table.name.value} webhooks`,
    tags: [TAG_WEBHOOK_CRUD],
    responses: {
      200: {
        description: 'get webhooks success',
        content: {
          'application/json': {
            schema: z.object({ webhooks: queryWebhook.omit({ filter: true }).array() }),
          },
        },
      },
    },
  }
}
