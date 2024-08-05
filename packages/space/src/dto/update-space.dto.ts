import { z } from "@undb/zod"
import { spaceAvatarSchema, spaceIdSchema, spaceNameSchema } from "../value-objects"

export const updateSpaceDTO = z.object({
  id: spaceIdSchema,
  name: spaceNameSchema,
  avatar: spaceAvatarSchema.optional(),
})

export type IUpdateSpaceDTO = z.infer<typeof updateSpaceDTO>
