import { queryUser } from '@undb/core'
import { z } from 'zod'

export const getUsersQueryOutput = z.object({
  users: queryUser.array(),
})
