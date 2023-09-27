import { queryBase } from '@undb/core'
import * as z from 'zod'

export const getBaseByIdQueryOutput = z.object({
  base: queryBase.optional(),
})
