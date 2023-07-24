import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import type { Record } from '@undb/core'
import { RecordId, recordIdSchema, type Table } from '@undb/core'
import { z } from 'zod'
import { COMPONENT_RECORD_ID, TAG_RECORD } from '../constants.js'
import type { ICreateOpenAPIMutateRecordSchema } from '../schema/mutate-record.schema.js'

export const updateRecords = (table: Table, schema: ICreateOpenAPIMutateRecordSchema, record?: Record): RouteConfig => {
  return {
    method: 'patch',
    path: `/tables/${table.id.value}/records/bulk`,
    description: `Update ${table.name.value} records bulkd`,
    summary: `Update ${table.name.value} records bulk`,
    tags: [TAG_RECORD],
    request: {
      body: {
        description: 'update records body',
        content: {
          'application/json': {
            schema: z.object({
              records: z
                .object({
                  id: recordIdSchema.openapi(COMPONENT_RECORD_ID, { example: record?.id.value ?? RecordId.createId() }),
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
        description: 'update records success',
      },
    },
  }
}
