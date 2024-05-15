import { z } from "zod"
import { fieldId } from "../schema/fields/field-id.vo"

export function createBaseFilterSchema<ItemType extends z.ZodTypeAny>(itemType: ItemType) {
  return z.object({
    fieldId: fieldId,
    disabled: z.boolean().optional(),
    meta: itemType,
  })
}
