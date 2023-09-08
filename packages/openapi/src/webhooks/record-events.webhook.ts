import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import type { Table } from '@undb/core'
import { TAG_RECORD_WEBHOOK } from '../constants.js'
import { createWebhookRecordEventsSchema } from '../schema/index.js'

export const recordEventsWebhook = (table: Table): RouteConfig => {
  return {
    method: 'post',
    path: 'record.events',
    description: 'record events webhook',
    tags: [TAG_RECORD_WEBHOOK],
    request: {
      body: {
        description: 'record created request body',
        content: {
          'application/json': {
            schema: createWebhookRecordEventsSchema(table),
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
