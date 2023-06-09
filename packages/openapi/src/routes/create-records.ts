import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { RecordId, recordIdSchema, type Table } from '@undb/core'
import { z } from 'zod'
import { COMPONENT_RECORD_ID, TAG_RECORD } from '../constants.js'
import type { ICreateOpenAPIMutateRecordSchema } from '../schema/mutate-record.schema.js'

export const createRecords = (table: Table, schema: ICreateOpenAPIMutateRecordSchema): RouteConfig => {
  return {
    method: 'post',
    path: `/tables/${table.id.value}/records/bulk`,
    description: `Create ${table.name.value} records bulkd`,
    summary: `Create ${table.name.value} records bulk`,
    tags: [TAG_RECORD],
    request: {
      body: {
        description: 'create records body',
        content: {
          'application/json': {
            schema: z.object({
              records: z
                .object({
                  id: recordIdSchema.openapi(COMPONENT_RECORD_ID, { example: RecordId.createId() }).optional(),
                  values: schema,
                })
                .array()
                .nonempty(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'create records success',
      },
    },
  }
}
