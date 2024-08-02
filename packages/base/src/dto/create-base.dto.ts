import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import { baseIdSchema, baseNameSchema } from "../value-objects"

export const createBaseDTO = z.object({
  id: baseIdSchema.optional(),
  name: baseNameSchema,
  spaceId: spaceIdSchema,
})

export type ICreateBaseDTO = z.infer<typeof createBaseDTO>
