import { queryUser } from '@undb/core'
import { z } from 'zod'

export const loginCommandInput = z.object({
  user: queryUser,
})
