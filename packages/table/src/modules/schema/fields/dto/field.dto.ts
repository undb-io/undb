import { z } from "@undb/zod"
import {
  createDateFieldDTO,
  createJsonFieldDTO,
  createSelectFieldDTO,
  dateFieldDTO,
  jsonFieldDTO,
  referenceFieldDTO,
  rollupFieldDTO,
  selectFieldDTO,
  updatedByFieldDTO,
} from "../variants"
import { attachmentFieldDTO } from "../variants/attachment-field"
import { autoIncrementFieldDTO } from "../variants/autoincrement-field"
import { checkboxFieldDTO, createCheckboxFieldDTO } from "../variants/checkbox-field"
import { createdAtFieldDTO } from "../variants/created-at-field"
import { createdByFieldDTO } from "../variants/created-by-field"
import { createEmailFieldDTO, emailFieldDTO } from "../variants/email-field"
import { idFieldDTO } from "../variants/id-field/id-field.vo"
import { createNumberFieldDTO, numberFieldDTO } from "../variants/number-field/number-field.vo"
import { ratingFieldDTO } from "../variants/rating-field"
import { createStringFieldDTO, stringFieldDTO } from "../variants/string-field/string-field.vo"
import { updatedAtFieldDTO } from "../variants/updated-at-field/updated-at-field.vo"
import { userFieldDTO } from "../variants/user-field"

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
])

export type IFieldDTO = z.infer<typeof fieldDTO>

export const inferCreateFieldDTO = z.discriminatedUnion("type", [
  createStringFieldDTO.omit({ id: true, name: true }),
  createNumberFieldDTO.omit({ id: true, name: true }),
  createEmailFieldDTO.omit({ id: true, name: true }),
  createDateFieldDTO.omit({ id: true, name: true }),
  createJsonFieldDTO.omit({ id: true, name: true }),
  createCheckboxFieldDTO.omit({ id: true, name: true }),
  createSelectFieldDTO.omit({ id: true, name: true }),
])

export type IInferCreateFieldDTO = z.infer<typeof inferCreateFieldDTO>
