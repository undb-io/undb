import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import { baseIdSchema, baseNameSchema } from "../value-objects"

export const uniqueBaseDTO = z
  .object({
    baseId: baseIdSchema,
    baseName: baseNameSchema,
    spaceId: spaceIdSchema,
  })
  .partial()

export type IUniqueBaseDTO = z.infer<typeof uniqueBaseDTO>
