import { baseNameSchema } from "@undb/base"
import {
  attachmentFieldConstraint,
  buttonFieldOption,
  checkboxFieldConstraint,
  currencyFieldConstraint,
  currencyFieldOption,
  dateFieldConstraint,
  durationFieldConstraint,
  emailFieldConstraint,
  fieldId,
  fieldName,
  jsonFieldConstraint,
  longTextFieldConstraint,
  numberFieldConstraint,
  percentageFieldConstraint,
  ratingFieldConstraint,
  referenceFieldConstraint,
  referenceFieldOption,
  rollupFieldOption,
  selectFieldConstraint,
  selectFieldOption,
  stringFieldConstraint,
  tableId,
  tableName,
  urlFieldConstraint,
  userFieldConstraint,
  viewFilterGroup,
} from "@undb/table"
import zodToJsonSchema from "zod-to-json-schema"
import { baseTemplateDTO } from "../dto/template-schema.dto"

export const baseTemplateSchema = zodToJsonSchema(baseTemplateDTO, {
  errorMessages: true,
  definitions: {
    tableId,
    tableName,
    baseName: baseNameSchema,
    fieldId,
    fieldName,
    viewFilterGroup,

    stringFieldConstraint,
    numberFieldConstraint,
    checkboxFieldConstraint,
    attachmentFieldConstraint,
    buttonFieldOption,

    referenceFieldConstraint,
    referenceFieldOption,
    rollupFieldOption,

    selectFieldOption,
    selectFieldConstraint,

    ratingFieldConstraint,
    emailFieldConstraint,
    urlFieldConstraint,
    dateFieldConstraint,
    jsonFieldConstraint,
    userFieldConstraint,
    longTextFieldConstraint,
    currencyFieldConstraint,
    currencyFieldOption,
    durationFieldConstraint,
    percentageFieldConstraint,
  },
})
