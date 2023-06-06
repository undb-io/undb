import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { recordIdSchema, type Table } from '@undb/core'
import { z } from 'zod'
import { COMPONENT_RECORD_ID, TAG_RECORD } from '../constants.js'

export const deleteRecordsByIds = (table: Table): RouteConfig => {
  return {
    method: 'delete',
    path: `/tables/${table.id.value}/records`,
    description: `Delete ${table.name.value} records by ids`,
    summary: `Delete ${table.name.value} records by ids`,
    tags: [TAG_RECORD],
    request: {
      body: {
        description: 'delete records ids',
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
        description: 'delete success',
      },
    },
  }
}
