import { baseNameSchema } from "@undb/base"
import {
  createFormWithoutNameDTO,
  createTablesAttachmentFieldDTO,
  createTablesButtonFieldDTO,
  createTablesCheckboxFieldDTO,
  createTablesCurrencyFieldDTO,
  createTablesDateFieldDTO,
  createTablesDurationFieldDTO,
  createTablesEmailFieldDTO,
  createTablesJsonFieldDTO,
  createTablesNumberFieldDTO,
  createTablesPercentageFieldDTO,
  createTablesRatingFieldDTO,
  createTablesReferenceFieldDTO,
  createTablesRollupFieldDTO,
  createTablesSelectFieldDTO,
  createTablesStringFieldDTO,
  createTablesUrlFieldDTO,
  createTablesUserFieldDTO,
  createViewWithoutNameDTO,
  fieldName,
  formName,
  tableId,
  tableName,
  viewName,
} from "@undb/table"
import { z } from "@undb/zod"

const createTemplateFieldDTO = z.discriminatedUnion("type", [
  createTablesStringFieldDTO.omit({ name: true }),
  createTablesNumberFieldDTO.omit({ name: true }),
  createTablesReferenceFieldDTO.omit({ name: true }),
  createTablesRollupFieldDTO.omit({ name: true }),
  createTablesSelectFieldDTO.omit({ name: true }),
  createTablesRatingFieldDTO.omit({ name: true }),
  createTablesEmailFieldDTO.omit({ name: true }),
  createTablesUrlFieldDTO.omit({ name: true }),
  createTablesAttachmentFieldDTO.omit({ name: true }),
  createTablesButtonFieldDTO.omit({ name: true }),
  createTablesCheckboxFieldDTO.omit({ name: true }),
  createTablesCurrencyFieldDTO.omit({ name: true }),
  createTablesDateFieldDTO.omit({ name: true }),
  createTablesJsonFieldDTO.omit({ name: true }),
  createTablesUserFieldDTO.omit({ name: true }),
  createTablesPercentageFieldDTO.omit({ name: true }),
  createTablesDurationFieldDTO.omit({ name: true }),
])

const templateSchemaDTO = z.record(fieldName, createTemplateFieldDTO)
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
