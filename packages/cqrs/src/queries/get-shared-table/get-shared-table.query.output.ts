import { queryTable } from '@undb/core'
import { z } from 'zod'

export const getSharedTableQueryOutput = z.object({
  table: queryTable,
})
