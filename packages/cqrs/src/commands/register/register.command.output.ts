import { z } from 'zod'

export const registerCommandOutput = z.object({
  email: z.string().email(),
  sub: z.string(),
})
