import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import type { Record } from '@undb/core'
import { RecordId, recordIdSchema, type Table } from '@undb/core'
import { z } from 'zod'
import { COMPONENT_RECORD_ID, TAG_RECORD } from '../constants.js'
import type { ICreateOpenAPIMutateRecordSchema } from '../schema/mutate-record.schema.js'

export const updateRecord = (table: Table, schema: ICreateOpenAPIMutateRecordSchema, record?: Record): RouteConfig => {
  return {
    method: 'patch',
    path: `/tables/${table.id.value}/records/{id}`,
    description: `Update ${table.name.value} record by id`,
    summary: `Update ${table.name.value} record by id`,
    tags: [TAG_RECORD],
    request: {
      params: z.object({
        id: recordIdSchema.openapi(COMPONENT_RECORD_ID, { example: record?.id.value ?? RecordId.createId() }),
      }),
      body: {
        description: 'update record body',
        content: {
          'application/json': {
            schema: z.object({
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
