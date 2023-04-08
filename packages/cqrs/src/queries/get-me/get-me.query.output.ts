import { queryUser } from '@undb/core'
import { z } from 'zod'

export const getMeQueryOutput = z.object({
  me: queryUser,
})
