import { queryFLS, queryRLS } from '@undb/authz'
import { queryTable } from '@undb/core'
import { z } from 'zod'

export const getTableQueryOutput = z.object({
  table: queryTable.optional(),
  rlss: queryRLS.array(),
  flss: queryFLS.array(),
})
