import { baseNameSchema } from "@undb/base"
import {
  createFieldWithoutNameDTO,
  createFormWithoutNameDTO,
  createViewWithoutNameDTO,
  fieldName,
  formName,
  tableId,
  tableName,
  viewName,
} from "@undb/table"
import { z } from "@undb/zod"

const templateSchemaDTO = z.record(fieldName, createFieldWithoutNameDTO)
const tempalteViewDTO = z.record(viewName, createViewWithoutNameDTO)
const templateFormDTO = z.record(formName, createFormWithoutNameDTO)

const basicTemplateTableDTO = z.object({
  id: tableId.optional(),
  schema: templateSchemaDTO,
  views: tempalteViewDTO.optional(),
  forms: templateFormDTO.optional(),

  records: z.record(z.any()).array().optional(),
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
