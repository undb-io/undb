import { z } from "zod"
import { fieldId } from "../schema/fields/field-id.vo"

export const baseFilter = z.object({
  fieldId: fieldId,
  disabled: z.boolean().optional(),
})
