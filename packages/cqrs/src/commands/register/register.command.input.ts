import { z } from 'zod'

export const registerCommandInput = z.object({
  email: z.string().email(),
  password: z.string().nonempty(),
})
