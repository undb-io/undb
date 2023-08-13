import { queryRLS } from '@undb/authz'
import * as z from 'zod'

export const getTableRLSSQueryOutput = z.object({
  rlss: queryRLS.array(),
})
