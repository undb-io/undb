import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { recordIdSchema, type Table } from '@undb/core'
import { COMPONENT_RECORD_ID } from 'src/constants'
import type { RecordSchema } from 'src/schema/open-api-record.schema'
import { z } from 'zod'

export const getRecordById = (table: Table, schema: RecordSchema): RouteConfig => {
  return {
    method: 'get',
    path: `/tables/${table.id.value}/records/{id}`,
    description: `Get ${table.name.value} record by id`,
    summary: `Get ${table.name.value} record by id`,
    request: {
      params: z.object({
        id: recordIdSchema.openapi(COMPONENT_RECORD_ID),
      }),
    },
    responses: {
      200: {
        description: `${table.name.value} id`,
        content: {
          'application/json': {
            schema: z.object({ data: schema.nullable() }),
          },
        },
      },
    },
  }
}
