import { z } from "@undb/zod"
import { spaceAvatarSchema, spaceIdSchema, spaceNameSchema } from "../value-objects"

export const createSpaceDTO = z.object({
  id: spaceIdSchema.optional(),
  avatar: spaceAvatarSchema.optional(),
  name: spaceNameSchema,
  isPersonal: z.boolean(),
})

export type ICreateSpaceDTO = z.infer<typeof createSpaceDTO>
