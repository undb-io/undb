import { z } from "@undb/zod"
import { fieldId } from "../field-id.vo"

export function createBaseConditionSchema<OptionType extends z.ZodTypeAny>(optionType: OptionType) {
  return z.object({
    field: fieldId,
    disabled: z.boolean().optional(),
    option: optionType,
  })
}
