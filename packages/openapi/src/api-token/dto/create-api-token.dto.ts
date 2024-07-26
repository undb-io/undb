import { z } from "@undb/zod"

export const createApiTokenDTO = z.object({
  userId: z.string(),
})

export type ICreateApiTokenDTO = z.infer<typeof createApiTokenDTO>
