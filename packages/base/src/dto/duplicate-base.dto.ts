import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import { baseIdSchema, baseNameSchema } from "../value-objects"

export const duplicateBaseDTO = z.object({
  id: baseIdSchema,
  spaceId: spaceIdSchema.optional(),
  name: baseNameSchema.optional(),
  includeData: z.boolean().optional(),
})

export type IDuplicateBaseDTO = z.infer<typeof duplicateBaseDTO>
