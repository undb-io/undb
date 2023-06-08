import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import type { IQueryRecordSchema } from '@undb/core'
import { RecordId, recordIdSchema, type Table } from '@undb/core'
import { z } from 'zod'
import { COMPONENT_RECORD_ID, TAG_RECORD } from '../constants.js'
import type { ICreateOpenAPIMutateRecordSchema } from '../schema/mutate-record.schema.js'

export const updateRecord = (
  table: Table,
  schema: ICreateOpenAPIMutateRecordSchema,
  record?: IQueryRecordSchema,
): RouteConfig => {
  return {
    method: 'patch',
    path: `/tables/${table.id.value}/records`,
    description: `Update ${table.name.value} record`,
    summary: `Update ${table.name.value} record`,
    tags: [TAG_RECORD],
    request: {
      body: {
        description: 'update record body',
        content: {
          'application/json': {
            schema: z.object({
              id: recordIdSchema.openapi(COMPONENT_RECORD_ID, { example: record?.id ?? RecordId.createId() }),
              values: schema,
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'update record success',
      },
    },
  }
}
