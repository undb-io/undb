import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { recordIdSchema, viewIdSchema, type Table } from '@undb/core'
import { createOpenAPIRecordSchema } from 'src/schema/open-api-record.schema'
import { z } from 'zod'

export const getRecordById = (table: Table): RouteConfig => {
  const recordSchema = createOpenAPIRecordSchema(table)
  return {
    method: 'get',
    path: `/tables/${table.id.value}/records/{id}`,
    description: `Get ${table.name.value} record by id`,
    summary: `Get ${table.name.value} record by id`,
    request: {
      params: z.object({
        id: recordIdSchema,
      }),
      query: z.object({
        viewId: viewIdSchema.optional(),
      }),
    },
    responses: {
      200: {
        description: `${table.name.value} id`,
        content: {
          'application/json': {
            schema: z.object({ data: recordSchema.nullable() }),
          },
        },
      },
    },
  }
}
