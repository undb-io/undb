import { baseNameSchema } from "@undb/base"
import { dashboardIdSchema, dashboardLayoutsSchema, dashboardNameSchema, dashboardWidgetsSchema } from "@undb/dashboard"
import {
  createFormWithoutNameDTO,
  createTablesAttachmentFieldDTO,
  createTablesButtonFieldDTO,
  createTablesCheckboxFieldDTO,
  createTablesCurrencyFieldDTO,
  createTablesDateFieldDTO,
  createTablesDateRangeFieldDTO,
  createTablesDurationFieldDTO,
  createTablesEmailFieldDTO,
  createTablesFormulaFieldDTO,
  createTablesJsonFieldDTO,
  createTablesLongTextFieldDTO,
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
  fieldId,
  fieldName,
  flattenCreateRecordDTO,
  formName,
  tableId,
  tableName,
  viewName,
  widgetName,
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
  createTablesDateRangeFieldDTO.omit(omitName),
  createTablesJsonFieldDTO.omit(omitName),
  createTablesUserFieldDTO.omit(omitName),
  createTablesPercentageFieldDTO.omit(omitName),
  createTablesDurationFieldDTO.omit(omitName),
  createTablesLongTextFieldDTO.omit(omitName),
  createTablesFormulaFieldDTO.omit(omitName),
])

const templateSchemaDTO = z.record(fieldName, createTemplateFieldDTO)
const tempalteViewDTO = z.record(viewName, createViewWithoutNameDTO)
const templateFormDTO = z.record(formName, createFormWithoutNameDTO)

const basicTemplateTableDTO = z.object({
  id: tableId.optional(),
  schema: templateSchemaDTO,
  fieldsOrder: z.array(fieldName.or(fieldId)).optional(),
  views: tempalteViewDTO.optional(),
  forms: templateFormDTO.optional(),

  records: flattenCreateRecordDTO.array().optional(),
})

const templateDashboardWidgetDTO = dashboardWidgetsSchema.element
  .omit({
    table: true,
  })
  .extend({
    // TODO: basename
    // TODO: maybe move this to dashboardWidgetSchema
    tableName: tableName,
  })

const basicTemplateDashboardDTO = z.object({
  id: dashboardIdSchema.optional(),
  layout: dashboardLayoutsSchema.optional().nullable(),
  widgets: z.record(widgetName, templateDashboardWidgetDTO).optional(),
})

export const baseTemplateDTO = z.record(
  baseNameSchema,
  z.object({
    tablesOrder: z.array(tableName).optional(),
    tables: z.record(tableName, basicTemplateTableDTO),
    dashboardsOrder: z.array(dashboardNameSchema).optional(),
    dashboards: z.record(dashboardNameSchema, basicTemplateDashboardDTO).optional(),
  }),
)

export type IBaseTemplateDTO = z.infer<typeof baseTemplateDTO>
