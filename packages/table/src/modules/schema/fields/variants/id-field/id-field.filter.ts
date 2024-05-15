import { z } from "zod"
import { createBaseFilterSchema } from "../../../../filters"

export function createIdFieldFilter<ItemType extends z.ZodTypeAny>(itemType: ItemType) {
  const base = createBaseFilterSchema(itemType)
  return z.union([
    z.object({ op: z.literal("eq"), value: z.string().min(1) }).merge(base),
    z.object({ op: z.literal("neq"), value: z.string().min(1) }).merge(base),
  ])
}

export type IIdFieldFilterSchema = ReturnType<typeof createIdFieldFilter>
export type IIdFieldFilter = z.infer<IIdFieldFilterSchema>
