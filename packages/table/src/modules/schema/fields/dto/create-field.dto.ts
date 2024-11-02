import { z } from "@undb/zod"
import {
  createAttachmentFieldDTO,
  createTablesAttachmentFieldDTO,
} from "../variants/attachment-field/attachment-field.vo"
import { createButtonFieldDTO, createTablesButtonFieldDTO } from "../variants/button-field/button-field.vo"
import { createCheckboxFieldDTO, createTablesCheckboxFieldDTO } from "../variants/checkbox-field/checkbox-field.vo"
import { createCurrencyFieldDTO, createTablesCurrencyFieldDTO } from "../variants/currency-field/currency-field.vo"
import { createDateFieldDTO, createTablesDateFieldDTO } from "../variants/date-field/date-field.vo"
import {
  createDateRangeFieldDTO,
  createTablesDateRangeFieldDTO,
} from "../variants/date-range-field/date-range-field.vo"
import { createDurationFieldDTO } from "../variants/duration-field/duration-field.vo"
import { createEmailFieldDTO, createTablesEmailFieldDTO } from "../variants/email-field/email-field.vo"
import { createFormulaFieldDTO, createTablesFormulaFieldDTO } from "../variants/formula-field"
import { createJsonFieldDTO, createTablesJsonFieldDTO } from "../variants/json-field/json-field.vo"
import { createLongTextFieldDTO, createTablesLongTextFieldDTO } from "../variants/long-text-field/long-text-field.vo"
import { createNumberFieldDTO, createTablesNumberFieldDTO } from "../variants/number-field/number-field.vo"
import {
  createPercentageFieldDTO,
  createTablesPercentageFieldDTO,
} from "../variants/percentage-field/percentage-field.vo"
import { createRatingFieldDTO, createTablesRatingFieldDTO } from "../variants/rating-field/rating-field.vo"
import { createReferenceFieldDTO, createTablesReferenceFieldDTO } from "../variants/reference-field/reference-field.vo"
import { createRollupFieldDTO, createTablesRollupFieldDTO } from "../variants/rollup-field/rollup-field.vo"
import { createSelectFieldDTO, createTablesSelectFieldDTO } from "../variants/select-field/select-field.vo"
import { createStringFieldDTO, createTablesStringFieldDTO } from "../variants/string-field/string-field.vo"
import { createTablesUrlFieldDTO, createUrlFieldDTO } from "../variants/url-field/url-field.vo"
import { createTablesUserFieldDTO, createUserFieldDTO } from "../variants/user-field/user-field.vo"

export const createFieldDTO = z.discriminatedUnion("type", [
  createStringFieldDTO,
  createNumberFieldDTO,
  createReferenceFieldDTO,
  createRollupFieldDTO,
  createSelectFieldDTO,
  createRatingFieldDTO,
  createEmailFieldDTO,
  createUrlFieldDTO,
  createAttachmentFieldDTO,
  createDateFieldDTO,
  createJsonFieldDTO,
  createCheckboxFieldDTO,
  createUserFieldDTO,
  createLongTextFieldDTO,
  createCurrencyFieldDTO,
  createButtonFieldDTO,
  createDurationFieldDTO,
  createPercentageFieldDTO,
  createFormulaFieldDTO,
  createDateRangeFieldDTO,
])

export const createTablesFieldDTO = z.discriminatedUnion("type", [
  createTablesStringFieldDTO,
  createTablesNumberFieldDTO,
  createTablesReferenceFieldDTO,
  createTablesRollupFieldDTO,
  createTablesSelectFieldDTO,
  createTablesRatingFieldDTO,
  createTablesEmailFieldDTO,
  createTablesUrlFieldDTO,
  createTablesAttachmentFieldDTO,
  createTablesButtonFieldDTO,
  createTablesCheckboxFieldDTO,
  createTablesCurrencyFieldDTO,
  createTablesDateFieldDTO,
  createTablesJsonFieldDTO,
  createTablesLongTextFieldDTO,
  createTablesUserFieldDTO,
  createTablesPercentageFieldDTO,
  createTablesFormulaFieldDTO,
  createTablesDateRangeFieldDTO,
])

export type ICreateFieldDTO = z.infer<typeof createFieldDTO>
