import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import { baseIdSchema, baseNameSchema, baseOptionSchema } from "../value-objects"

export const baseDTO = z.object({
  id: baseIdSchema,
  name: baseNameSchema,
  spaceId: spaceIdSchema,
  option: baseOptionSchema.optional().nullable(),
})

export type IBaseDTO = z.infer<typeof baseDTO>
