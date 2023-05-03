import { z } from 'zod'

export const updateProfileCommandInput = z.object({
  userId: z.string().nonempty(),
  username: z.string().nonempty().optional(),
  avatar: z.string().nullable().optional(),
})
