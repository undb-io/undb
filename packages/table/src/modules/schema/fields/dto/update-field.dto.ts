import { z } from "@undb/zod"
import { updateAttachmentFieldDTO } from "../variants/attachment-field"
import { updateAutoIncrementFieldDTO } from "../variants/autoincrement-field/autoincrement-field.vo"
import { updateButtonFieldDTO } from "../variants/button-field/button-field.vo"
import { updateCheckboxFieldDTO } from "../variants/checkbox-field"
import { updateCreatedAtFieldDTO } from "../variants/created-at-field/created-at-field.vo"
import { updateCreatedByFieldDTO } from "../variants/created-by-field/created-by-field.vo"
import { updateCurrencyFieldDTO } from "../variants/currency-field"
import { updateDateFieldDTO } from "../variants/date-field/date-field.vo"
import { updateDurationFieldDTO } from "../variants/duration-field/duration-field.vo"
import { updateEmailFieldDTO } from "../variants/email-field"
import { updateFormulaFieldDTO } from "../variants/formula-field/formula-field.vo"
import { updateIdFieldDTO } from "../variants/id-field/id-field.vo"
import { updateJsonFieldDTO } from "../variants/json-field/json-field.vo"
import { updateNumberFieldDTO } from "../variants/number-field/number-field.vo"
import { updatePercentageFieldDTO } from "../variants/percentage-field/percentage-field.vo"
import { updateRatingFieldDTO } from "../variants/rating-field/rating-field.vo"
import { updateReferenceFieldDTO } from "../variants/reference-field/reference-field.vo"
import { updateRollupFieldDTO } from "../variants/rollup-field/rollup-field.vo"
import { updateSelectFieldDTO } from "../variants/select-field/select-field.vo"
import { updateStringFieldDTO } from "../variants/string-field/string-field.vo"
import { updateUpdatedAtFieldDTO } from "../variants/updated-at-field/updated-at-field.vo"
import { updateUpdatedByFieldDTO } from "../variants/updated-by-field/updated-by-field.vo"
import { updateUserFieldDTO } from "../variants/user-field"

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
])

export type IUpdateFieldDTO = z.infer<typeof updateFieldDTO>
