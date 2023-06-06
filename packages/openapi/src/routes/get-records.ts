import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { viewIdSchema, type Table } from '@undb/core'
import { COMPONENT_VIEW_ID } from 'src/constants'
import { z } from 'zod'
import type { RecordSchema } from '../schema/open-api-record.schema'

export const getRecords = (table: Table, schema: RecordSchema): RouteConfig => {
  return {
    method: 'get',
    path: `/tables/${table.id.value}/records`,
    description: `List ${table.name.value} records`,
    summary: `List ${table.name.value} records`,
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
            schema: z.object({ data: schema.array() }),
          },
        },
      },
    },
  }
}
