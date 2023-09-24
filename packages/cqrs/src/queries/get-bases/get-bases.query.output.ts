import { queryBase } from '@undb/core'
import * as z from 'zod'

export const getBasesQueryOutput = z.object({
  bases: queryBase.array(),
})
