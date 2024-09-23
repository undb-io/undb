import { baseNameSchema } from "@undb/base"
import {
  createAttachmentFieldDTO,
  createButtonFieldDTO,
  createCheckboxFieldDTO,
  createCurrencyFieldDTO,
  createDateFieldDTO,
  createDurationFieldDTO,
  createEmailFieldDTO,
  createFormWithoutNameDTO,
  createJsonFieldDTO,
  createLongTextFieldDTO,
  createNumberFieldDTO,
  createPercentageFieldDTO,
  createRatingFieldDTO,
  createReferenceFieldDTO,
  createReferenceFieldOption,
  createRollupFieldDTO,
  createSelectFieldDTO,
  createStringFieldDTO,
  createUrlFieldDTO,
  createUserFieldDTO,
  createViewWithoutNameDTO,
  fieldName,
  formName,
  tableId,
  tableName,
  viewName,
} from "@undb/table"
import { z } from "@undb/zod"

const createTemplateReferenceOption = createReferenceFieldOption
  .omit({
    foreignTableId: true,
  })
  .merge(
    z.object({
      foreignTable: z.object({
        baseName: baseNameSchema,
        tableName: tableName,
      }),
    }),
  )

const createTemplateFieldDTO = z.discriminatedUnion("type", [
  createStringFieldDTO.omit({ name: true }),
  createNumberFieldDTO.omit({ name: true }),
  createReferenceFieldDTO.omit({ name: true }).merge(
    z.object({
      option: createTemplateReferenceOption,
    }),
  ),
  createRollupFieldDTO.omit({ name: true }),
  createSelectFieldDTO.omit({ name: true }),
  createRatingFieldDTO.omit({ name: true }),
  createEmailFieldDTO.omit({ name: true }),
  createUrlFieldDTO.omit({ name: true }),
  createAttachmentFieldDTO.omit({ name: true }),
  createDateFieldDTO.omit({ name: true }),
  createJsonFieldDTO.omit({ name: true }),
  createCheckboxFieldDTO.omit({ name: true }),
  createUserFieldDTO.omit({ name: true }),
  createLongTextFieldDTO.omit({ name: true }),
  createCurrencyFieldDTO.omit({ name: true }),
  createButtonFieldDTO.omit({ name: true }),
  createDurationFieldDTO.omit({ name: true }),
  createPercentageFieldDTO.omit({ name: true }),
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
