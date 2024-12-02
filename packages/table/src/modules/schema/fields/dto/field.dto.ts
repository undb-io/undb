import { z } from "@undb/zod"
import { attachmentFieldDTO } from "../variants/attachment-field/attachment-field.vo"
import { autoIncrementFieldDTO } from "../variants/autoincrement-field/autoincrement-field.vo"
import { buttonFieldDTO } from "../variants/button-field/button-field.vo"
import { checkboxFieldDTO, createCheckboxFieldDTO } from "../variants/checkbox-field/checkbox-field.vo"
import { createdAtFieldDTO } from "../variants/created-at-field/created-at-field.vo"
import { createdByFieldDTO } from "../variants/created-by-field/created-by-field.vo"
import { createCurrencyFieldDTO, currencyFieldDTO } from "../variants/currency-field/currency-field.vo"
import { createDateFieldDTO, dateFieldDTO } from "../variants/date-field/date-field.vo"
import { dateRangeFieldDTO } from "../variants/date-range-field/date-range-field.vo"
import { durationFieldDTO } from "../variants/duration-field/duration-field.vo"
import { createEmailFieldDTO, emailFieldDTO } from "../variants/email-field/email-field.vo"
import { formulaFieldDTO } from "../variants/formula-field/formula-field.vo"
import { idFieldDTO } from "../variants/id-field/id-field.vo"
import { createJsonFieldDTO, jsonFieldDTO } from "../variants/json-field/json-field.vo"
import { createLongTextFieldDTO, longTextFieldDTO } from "../variants/long-text-field/long-text-field.vo"
import { createNumberFieldDTO, numberFieldDTO } from "../variants/number-field/number-field.vo"
import { percentageFieldDTO } from "../variants/percentage-field/percentage-field.vo"
import { ratingFieldDTO } from "../variants/rating-field/rating-field.vo"
import { referenceFieldDTO } from "../variants/reference-field/reference-field.vo"
import { rollupFieldDTO } from "../variants/rollup-field/rollup-field.vo"
import { createSelectFieldDTO, selectFieldDTO } from "../variants/select-field/select-field.vo"
import { createStringFieldDTO, stringFieldDTO } from "../variants/string-field/string-field.vo"
import { updatedAtFieldDTO } from "../variants/updated-at-field/updated-at-field.vo"
import { updatedByFieldDTO } from "../variants/updated-by-field/updated-by-field.vo"
import { createUrlFieldDTO, urlFieldDTO } from "../variants/url-field/url-field.vo"
import { userFieldDTO } from "../variants/user-field/user-field.vo"

export const fieldDTO = z.discriminatedUnion("type", [
  stringFieldDTO,
  numberFieldDTO,
  idFieldDTO,
  createdAtFieldDTO,
  autoIncrementFieldDTO,
  updatedAtFieldDTO,
  createdByFieldDTO,
  updatedByFieldDTO,
  referenceFieldDTO,
  rollupFieldDTO,
  selectFieldDTO,
  ratingFieldDTO,
  emailFieldDTO,
  attachmentFieldDTO,
  dateFieldDTO,
  jsonFieldDTO,
  checkboxFieldDTO,
  userFieldDTO,
  longTextFieldDTO,
  urlFieldDTO,
  currencyFieldDTO,
  buttonFieldDTO,
  durationFieldDTO,
  percentageFieldDTO,
  formulaFieldDTO,
  dateRangeFieldDTO,
])

export type IFieldDTO = z.infer<typeof fieldDTO>

export const inferCreateFieldDTO = z.discriminatedUnion("type", [
  createStringFieldDTO.omit({ id: true, name: true }),
  createNumberFieldDTO.omit({ id: true, name: true }),
  createEmailFieldDTO.omit({ id: true, name: true }),
  createCurrencyFieldDTO.omit({ id: true, name: true }),
  createDateFieldDTO.omit({ id: true, name: true }),
  createJsonFieldDTO.omit({ id: true, name: true }),
  createCheckboxFieldDTO.omit({ id: true, name: true }),
  createSelectFieldDTO.omit({ id: true, name: true }),
  createUrlFieldDTO.omit({ id: true, name: true }),
  createLongTextFieldDTO.omit({ id: true, name: true }),
])

export type IInferCreateFieldDTO = z.infer<typeof inferCreateFieldDTO>
