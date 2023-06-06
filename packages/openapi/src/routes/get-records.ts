import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { viewIdSchema, type Table } from '@undb/core'
import { z } from 'zod'
import { COMPONENT_VIEW_ID, TAG_RECORD } from '../constants.js'
import type { RecordSchema } from '../schema/open-api-record.schema.js'

export const getRecords = (table: Table, schema: RecordSchema): RouteConfig => {
  return {
    method: 'get',
    path: `/tables/${table.id.value}/records`,
    description: `List ${table.name.value} records`,
    summary: `List ${table.name.value} records`,
    tags: [TAG_RECORD],
    request: {
      query: z.object({
        viewId: viewIdSchema.optional().openapi(COMPONENT_VIEW_ID),
      }),
    },
    responses: {
      200: {
        description: `${table.name.value} records`,
        content: {
          'application/json': {
            schema: z.object({ records: schema.array() }),
          },
        },
      },
    },
  }
}
