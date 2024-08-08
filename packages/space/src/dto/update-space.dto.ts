import { z } from "@undb/zod"
import { spaceAvatarSchema, spaceNameSchema } from "../value-objects"

export const updateSpaceDTO = z.object({
  name: spaceNameSchema,
  avatar: spaceAvatarSchema.optional(),
})

export type IUpdateSpaceDTO = z.infer<typeof updateSpaceDTO>
