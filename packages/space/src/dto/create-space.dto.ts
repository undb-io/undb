import { z } from "@undb/zod"
import { spaceIdSchema, spaceNameSchema } from "../value-objects"

export const createSpaceDTO = z.object({
  id: spaceIdSchema.optional(),
  name: spaceNameSchema,
  isPersonal: z.boolean(),
})

export type ICreateSpaceDTO = z.infer<typeof createSpaceDTO>
