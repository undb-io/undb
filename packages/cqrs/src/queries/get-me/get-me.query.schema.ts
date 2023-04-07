import { queryUser } from '@egodb/core'
import * as z from 'zod'

export const getMeQuerySchema = z.object({
  me: queryUser,
})
