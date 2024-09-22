import { baseNameSchema } from "@undb/base"
import { createFieldWithoutNameDTO, fieldId, tableId, tableName } from "@undb/table"
import { z } from "@undb/zod"

const templateSchemaDTO = z.record(fieldId, createFieldWithoutNameDTO)

const basicTemplateTableDTO = z.object({
  id: tableId.optional(),
  schema: templateSchemaDTO,
})

export const baseTemplateDTO = z.record(
  baseNameSchema,
  z.object({
    tables: z.record(tableName, basicTemplateTableDTO),
  }),
)

export type IBaseTemplateDTO = z.infer<typeof baseTemplateDTO>

export const tableTemplateDTO = z
  .object({
    name: tableName,
  })
  .merge(basicTemplateTableDTO)

export type ITableTemplateDTO = z.infer<typeof tableTemplateDTO>
