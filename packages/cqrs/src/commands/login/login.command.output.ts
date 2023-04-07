import { z } from 'zod'

export const loginCommandOutput = z.object({
  access_token: z.string(),
})
