import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { recordIdSchema, type Table } from '@undb/core'
import { z } from 'zod'
import { COMPONENT_RECORD_ID, TAG_RECORD } from '../constants.js'

export const duplicateRecordsByIds = (table: Table): RouteConfig => {
  return {
    method: 'post',
    path: `/tables/${table.id.value}/records`,
    description: `Duplicate ${table.name.value} records by ids`,
    summary: `Duplicate ${table.name.value} records by ids`,
    tags: [TAG_RECORD],
    request: {
      body: {
        description: 'duplicate records ids',
        required: true,
        content: {
          'application/json': {
            schema: z.object({
              ids: recordIdSchema.openapi(COMPONENT_RECORD_ID).array().nonempty(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'duplicate records success',
      },
    },
  }
}
