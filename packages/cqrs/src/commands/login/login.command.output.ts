import { z } from 'zod'

export const loginCommandOutput = z.object({
  email: z.string().email(),
  sub: z.string(),
})
