import { z } from "@undb/zod"
import { spaceAvatarSchema, spaceIdSchema, spaceNameSchema } from "../value-objects"

export const spaceDTO = z.object({
  id: spaceIdSchema,
  name: spaceNameSchema,
  avatar: spaceAvatarSchema.nullable(),
  isPersonal: z.boolean(),
})

export type ISpaceDTO = z.infer<typeof spaceDTO>
