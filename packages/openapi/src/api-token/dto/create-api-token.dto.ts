import { z } from "@undb/zod"

export const createApiTokenDTO = z.object({
  name: z.string(),
  userId: z.string(),
  spaceId: z.string(),
})

export type ICreateApiTokenDTO = z.infer<typeof createApiTokenDTO>
