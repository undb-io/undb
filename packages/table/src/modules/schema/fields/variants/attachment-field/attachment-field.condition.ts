import { z } from "@undb/zod"
import { createBaseConditionSchema } from "../../condition/base.condition"

export function createAttachmentFieldCondition<ItemType extends z.ZodTypeAny>(itemType: ItemType) {
  const base = createBaseConditionSchema(itemType)
  return z.union([
    z.object({ op: z.literal("is_empty"), value: z.undefined() }).merge(base),
    z.object({ op: z.literal("is_not_empty"), value: z.undefined() }).merge(base),
  ])
}

export type IAttachmentFieldConditionSchema = ReturnType<typeof createAttachmentFieldCondition>
export type IAttachmentFieldCondition = z.infer<IAttachmentFieldConditionSchema>
