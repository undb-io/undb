import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { viewIdSchema, type Table } from '@undb/core'
import { z } from 'zod'
import type { RecordSchema } from '../schema/open-api-record.schema'

export const listRecords = (table: Table, schema: RecordSchema): RouteConfig => {
  return {
    method: 'get',
    path: `/tables/${table.id.value}/records`,
    description: `List ${table.name.value} records`,
    summary: `List ${table.name.value} records`,
    request: {
      query: z.object({
        viewId: viewIdSchema.optional(),
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
