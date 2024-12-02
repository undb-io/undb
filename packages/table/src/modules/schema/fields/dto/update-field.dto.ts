import { z } from "@undb/zod"
import { match } from "ts-pattern"
import type { PartialDeep } from "type-fest"
import type { TableDo } from "../../../../table.do"
import type { Field, FieldType } from "../field.type"
import { updateAttachmentFieldDTO } from "../variants/attachment-field/attachment-field.vo"
import { updateAutoIncrementFieldDTO } from "../variants/autoincrement-field/autoincrement-field.vo"
import { updateButtonFieldDTO } from "../variants/button-field/button-field.vo"
import { updateCheckboxFieldDTO } from "../variants/checkbox-field/checkbox-field.vo"
import { updateCreatedAtFieldDTO } from "../variants/created-at-field/created-at-field.vo"
import { updateCreatedByFieldDTO } from "../variants/created-by-field/created-by-field.vo"
import { updateCurrencyFieldDTO } from "../variants/currency-field/currency-field.vo"
import { updateDateFieldDTO } from "../variants/date-field/date-field.vo"
import { updateDateRangeFieldDTO } from "../variants/date-range-field/date-range-field.vo"
import { updateDurationFieldDTO } from "../variants/duration-field/duration-field.vo"
import { updateEmailFieldDTO } from "../variants/email-field/email-field.vo"
import { updateFormulaFieldDTO } from "../variants/formula-field/formula-field.vo"
import { updateIdFieldDTO } from "../variants/id-field/id-field.vo"
import { updateJsonFieldDTO } from "../variants/json-field/json-field.vo"
import { updateLongTextFieldDTO } from "../variants/long-text-field/long-text-field.vo"
import { updateNumberFieldDTO } from "../variants/number-field/number-field.vo"
import { updatePercentageFieldDTO } from "../variants/percentage-field/percentage-field.vo"
import { updateRatingFieldDTO } from "../variants/rating-field/rating-field.vo"
import { updateReferenceFieldDTO } from "../variants/reference-field/reference-field.vo"
import { updateRollupFieldDTO } from "../variants/rollup-field/rollup-field.vo"
import { updateSelectFieldDTO } from "../variants/select-field/select-field.vo"
import { updateStringFieldDTO } from "../variants/string-field/string-field.vo"
import { updateUpdatedAtFieldDTO } from "../variants/updated-at-field/updated-at-field.vo"
import { updateUpdatedByFieldDTO } from "../variants/updated-by-field/updated-by-field.vo"
import { updateUrlFieldDTO } from "../variants/url-field/url-field.vo"
import { updateUserFieldDTO } from "../variants/user-field/user-field.vo"

export const updateFieldDTO = z.discriminatedUnion("type", [
  updateIdFieldDTO,
  updateStringFieldDTO,
  updateNumberFieldDTO,
  updateCreatedAtFieldDTO,
  updateCreatedByFieldDTO,
  updateUpdatedAtFieldDTO,
  updateUpdatedByFieldDTO,
  updateAutoIncrementFieldDTO,
  updateReferenceFieldDTO,
  updateRatingFieldDTO,
  updateEmailFieldDTO,
  updateAttachmentFieldDTO,
  updateDateFieldDTO,
  updateJsonFieldDTO,
  updateCheckboxFieldDTO,
  updateUserFieldDTO,
  updateSelectFieldDTO,
  updateRollupFieldDTO,
  updateCurrencyFieldDTO,
  updateButtonFieldDTO,
  updateDurationFieldDTO,
  updatePercentageFieldDTO,
  updateFormulaFieldDTO,
  updateDateRangeFieldDTO,
  updateLongTextFieldDTO,
  updateUrlFieldDTO,
])

export type IUpdateFieldDTO = z.infer<typeof updateFieldDTO>

export const createUpdateFieldDTO = (table: TableDo, field: Field, type: FieldType) => {
  return match(type)
    .returnType<PartialDeep<IUpdateFieldDTO>>()
    .with(
      "number",
      "string",
      "rating",
      "percentage",
      "duration",
      "longText",
      "email",
      "url",
      "checkbox",
      "json",
      "attachment",
      (type) => {
        return {
          id: field.id.value,
          name: field.name.value,
          type,
          constraint: {
            required: field.required,
          },
          display: field.display,
        }
      },
    )
    .with("reference", (type) => {
      return {
        id: field.id.value,
        name: field.name.value,
        type,
        constraint: {
          required: field.required,
        },
        display: false,
      }
    })
    .with("rollup", "formula", "button", (type) => {
      return {
        id: field.id.value,
        name: field.name.value,
        type,
        display: false,
      }
    })
    .with("date", "dateRange", (type) => {
      return {
        id: field.id.value,
        name: field.name.value,
        type,
        display: false,
        option: {
          format: "yyyy-MM-dd",
          includeTime: false,
        },
      }
    })
    .with("user", (type) => {
      return {
        id: field.id.value,
        name: field.name.value,
        type,
        display: false,
        constraint: {
          required: field.required,
          max: 1,
        },
      }
    })
    .with("select", (type) => {
      return {
        id: field.id.value,
        name: field.name.value,
        type,
        display: false,
        constraint: {
          required: field.required,
          max: 1,
        },
      }
    })
    .with("currency", (type) => {
      return {
        id: field.id.value,
        name: field.name.value,
        type,
        display: false,
        constraint: {
          required: field.required,
        },
        option: {
          symbol: "$",
        },
      }
    })
    .otherwise((type) => {
      throw new Error(`Invalid field type to update: ${type}`)
    })
}
