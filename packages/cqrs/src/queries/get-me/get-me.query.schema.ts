import { queryUser } from '@undb/core'
import * as z from 'zod'

export const getMeQuerySchema = z.object({
  me: queryUser,
})
