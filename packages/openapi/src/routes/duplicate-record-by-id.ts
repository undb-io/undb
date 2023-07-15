import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import { recordIdSchema, type Table } from '@undb/core'
import { z } from 'zod'
import { COMPONENT_RECORD_ID, TAG_RECORD } from '../constants.js'

export const duplicateRecordById = (table: Table): RouteConfig => {
  return {
    method: 'post',
    path: `/tables/${table.id.value}/records/{id}`,
    description: `Duplicate ${table.name.value} record by id`,
    summary: `Duplicate ${table.name.value} record by id`,
    tags: [TAG_RECORD],
    request: {
      params: z.object({
        id: recordIdSchema.openapi(COMPONENT_RECORD_ID),
      }),
    },
    responses: {
      200: {
        description: `duplicate record success`,
      },
    },
  }
}
