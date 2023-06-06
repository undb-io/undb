import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { recordIdSchema, type Table } from '@undb/core'
import { z } from 'zod'
import { COMPONENT_RECORD_ID, TAG_RECORD } from '../constants.js'
import type { RecordSchema } from '../schema/open-api-record.schema.js'

export const getRecordById = (table: Table, schema: RecordSchema): RouteConfig => {
  return {
    method: 'get',
    path: `/tables/${table.id.value}/records/{id}`,
    description: `Get ${table.name.value} record by id`,
    summary: `Get ${table.name.value} record by id`,
    tags: [TAG_RECORD],
    request: {
      params: z.object({
        id: recordIdSchema.openapi(COMPONENT_RECORD_ID),
      }),
    },
    responses: {
      200: {
        description: `${table.name.value} record`,
        content: {
          'application/json': {
            schema: z.object({ record: schema.nullable() }),
          },
        },
      },
    },
  }
}
