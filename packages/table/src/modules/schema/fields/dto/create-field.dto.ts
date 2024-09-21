import { z } from "@undb/zod"
import { createAttachmentFieldDTO } from "../variants/attachment-field/attachment-field.vo"
import { createButtonFieldDTO } from "../variants/button-field/button-field.vo"
import { createCheckboxFieldDTO } from "../variants/checkbox-field/checkbox-field.vo"
import { createCurrencyFieldDTO } from "../variants/currency-field/currency-field.vo"
import { createDateFieldDTO } from "../variants/date-field/date-field.vo"
import { createDurationFieldDTO } from "../variants/duration-field/duration-field.vo"
import { createEmailFieldDTO } from "../variants/email-field/email-field.vo"
import { createJsonFieldDTO } from "../variants/json-field/json-field.vo"
import { createLongTextFieldDTO } from "../variants/long-text-field/long-text-field.vo"
import { createNumberFieldDTO } from "../variants/number-field/number-field.vo"
import { createPercentageFieldDTO } from "../variants/percentage-field/percentage-field.vo"
import { createRatingFieldDTO } from "../variants/rating-field/rating-field.vo"
import { createReferenceFieldDTO } from "../variants/reference-field/reference-field.vo"
import { createRollupFieldDTO } from "../variants/rollup-field/rollup-field.vo"
import { createSelectFieldDTO } from "../variants/select-field/select-field.vo"
import { createStringFieldDTO } from "../variants/string-field/string-field.vo"
import { createUrlFieldDTO } from "../variants/url-field/url-field.vo"
import { createUserFieldDTO } from "../variants/user-field/user-field.vo"

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
])

export const createFieldWithoutNameDTO = z.discriminatedUnion("type", [
  createStringFieldDTO.omit({ name: true }),
  createNumberFieldDTO.omit({ name: true }),
  createReferenceFieldDTO.omit({ name: true }),
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

export type ICreateFieldDTO = z.infer<typeof createFieldDTO>
