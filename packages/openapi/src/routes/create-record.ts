import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { RecordId, recordIdSchema, type Table } from '@undb/core'
import { z } from 'zod'
import { COMPONENT_RECORD_ID, TAG_RECORD } from '../constants.js'
import type { ICreateOpenAPIMutateRecordSchema } from '../schema/mutate-record.schema.js'

export const createRecord = (table: Table, schema: ICreateOpenAPIMutateRecordSchema): RouteConfig => {
  return {
    method: 'post',
    path: `/tables/${table.id.value}/records`,
    description: `Create ${table.name.value} record`,
    summary: `Create ${table.name.value} record`,
    tags: [TAG_RECORD],
    request: {
      body: {
        description: 'create record body',
        content: {
          'application/json': {
            schema: z.object({
              id: recordIdSchema.openapi(COMPONENT_RECORD_ID, { example: RecordId.createId() }).optional(),
              values: schema,
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'create record success',
      },
    },
  }
}
