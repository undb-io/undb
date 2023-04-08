import { queryUser } from '@egodb/core'
import { z } from 'zod'

export const getMeQueryOutput = z.object({
  me: queryUser,
})
