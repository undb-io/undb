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
  flattenCreateRecordDTO,
  formName,
  tableId,
  tableName,
  viewName,
} from "@undb/table"
import { z } from "@undb/zod"

const omitName = { name: true } as const

const createTemplateFieldDTO = z.discriminatedUnion("type", [
  createTablesStringFieldDTO.omit(omitName),
  createTablesNumberFieldDTO.omit(omitName),
  createTablesReferenceFieldDTO.omit(omitName),
  createTablesRollupFieldDTO.omit(omitName),
  createTablesSelectFieldDTO.omit(omitName),
  createTablesRatingFieldDTO.omit(omitName),
  createTablesEmailFieldDTO.omit(omitName),
  createTablesUrlFieldDTO.omit(omitName),
  createTablesAttachmentFieldDTO.omit(omitName),
  createTablesButtonFieldDTO.omit(omitName),
  createTablesCheckboxFieldDTO.omit(omitName),
  createTablesCurrencyFieldDTO.omit(omitName),
  createTablesDateFieldDTO.omit(omitName),
  createTablesJsonFieldDTO.omit(omitName),
  createTablesUserFieldDTO.omit(omitName),
  createTablesPercentageFieldDTO.omit(omitName),
  createTablesDurationFieldDTO.omit(omitName),
])

const templateSchemaDTO = z.record(fieldName, createTemplateFieldDTO)
const tempalteViewDTO = z.record(viewName, createViewWithoutNameDTO)
const templateFormDTO = z.record(formName, createFormWithoutNameDTO)

const basicTemplateTableDTO = z.object({
  id: tableId.optional(),
  schema: templateSchemaDTO,
  views: tempalteViewDTO.optional(),
  forms: templateFormDTO.optional(),

  records: flattenCreateRecordDTO.array().optional(),
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
