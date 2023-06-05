import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { viewIdSchema, type Table } from '@undb/core'
import { createOpenAPIRecordSchema } from 'src/schema/open-api-record.schema'
import { z } from 'zod'

export const listRecords = (table: Table): RouteConfig => {
  const recordSchema = createOpenAPIRecordSchema(table)
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
            schema: z.object({ data: recordSchema.array() }),
          },
        },
      },
    },
  }
}
