import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { createRecordEventReadableValueSchema, type Table } from '@undb/core'
import { z } from 'zod'
import { TAG_RECORD, TAG_SUBSCRIPTION } from '../constants.js'

export const subscription = (table: Table): RouteConfig => {
  const event = createRecordEventReadableValueSchema(table)
  return {
    method: 'get',
    path: `/tables/${table.id.value}/subscription`,
    description: `Subscribe ${table.name.value} record events`,
    summary: `Subscribe ${table.name.value} record events`,
    tags: [TAG_RECORD, TAG_SUBSCRIPTION],
    responses: {
      200: {
        description: 'subscription event schema',
        content: {
          'text/event-stream': {
            schema: z.object({
              event,
            }),
          },
        },
      },
    },
  }
}
