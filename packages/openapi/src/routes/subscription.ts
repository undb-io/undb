import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { recorEventSchema, type Table } from '@undb/core'
import { z } from 'zod'
import { COMPONENT_RECORD_EVENT, TAG_RECORD, TAG_SUBSCRIPTION } from '../constants.js'

export const subscription = (table: Table): RouteConfig => {
  return {
    method: 'get',
    path: `/tables/${table.id.value}/subscription`,
    description: `Subscribe ${table.name.value} record events`,
    summary: `Subscribe ${table.name.value} record events`,
    tags: [TAG_RECORD, TAG_SUBSCRIPTION],
    responses: {
      200: {
        description: 'create record success',
        content: {
          'text/event-stream': {
            schema: z.object({
              event: recorEventSchema.openapi(COMPONENT_RECORD_EVENT),
            }),
          },
        },
      },
    },
  }
}
