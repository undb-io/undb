import { baseNameSchema } from "@undb/base"
import { createFieldWithoutNameDTO, fieldId, tableName } from "@undb/table"
import { z } from "@undb/zod"

export const baseTemplateDTO = z.object({
  name: baseNameSchema,
  tables: z.record(
    tableName,
    z.object({
      schema: z.record(fieldId, createFieldWithoutNameDTO),
    }),
  ),
})

export type IBaseTemplateDTO = z.infer<typeof baseTemplateDTO>
