import { z } from 'zod'

export const loginCommandInput = z.object({
  // TODO: login user
  user: z.object({}),
})
