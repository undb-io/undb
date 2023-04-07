import { queryUser } from '@egodb/core'
import { z } from 'zod'

export const loginCommandInput = z.object({
  user: queryUser,
})
