import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { baseTemplateDTO } from "../../dto"

const baseTemplate = z.object({
  type: z.literal("base"),
  template: baseTemplateDTO,
})

export const templateSchemaVariants = baseTemplate

export type ITemplateSchemaVariants = z.infer<typeof templateSchemaVariants>

export class TemplateSchemaVariantsVO extends ValueObject<ITemplateSchemaVariants> {}
