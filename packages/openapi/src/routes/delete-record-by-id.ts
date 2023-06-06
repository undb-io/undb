import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { recordIdSchema, type Table } from '@undb/core'
import { z } from 'zod'
import { COMPONENT_RECORD_ID, TAG_RECORD } from '../constants.js'

export const deleteRecordById = (table: Table): RouteConfig => {
  return {
    method: 'delete',
    path: `/tables/${table.id.value}/records/{id}`,
    description: `Delete ${table.name.value} record by id`,
    summary: `Delete ${table.name.value} record by id`,
    tags: [TAG_RECORD],
    request: {
      params: z.object({
        id: recordIdSchema.openapi(COMPONENT_RECORD_ID),
      }),
    },
    responses: {
      200: {
        description: 'delete success',
      },
    },
  }
}
