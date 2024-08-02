import { z } from "@undb/zod"
import { spaceIdSchema, spaceNameSchema } from "../value-objects"

export const updateSpaceDTO = z.object({
  id: spaceIdSchema,
  name: spaceNameSchema,
})

export type IUpdateSpaceDTO = z.infer<typeof updateSpaceDTO>
