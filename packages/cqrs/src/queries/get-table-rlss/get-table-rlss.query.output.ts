import { queryRLS } from '@undb/authz/dist'
import * as z from 'zod'

export const getTableRLSSQueryOutput = z.object({
  rlss: queryRLS.array(),
})
