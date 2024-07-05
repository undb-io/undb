import { z } from "@undb/zod"
import { createDateFieldDTO, createJsonFieldDTO } from "../variants"
import { createAttachmentFieldDTO } from "../variants/attachment-field"
import { createEmailFieldDTO } from "../variants/email-field"
import { createNumberFieldDTO } from "../variants/number-field/number-field.vo"
import { createRatingFieldDTO } from "../variants/rating-field/rating-field.vo"
import { createReferenceFieldDTO } from "../variants/reference-field/reference-field.vo"
import { createRollupFieldDTO } from "../variants/rollup-field/rollup-field.vo"
import { createSelectFieldDTO } from "../variants/select-field/select-field.vo"
import { createStringFieldDTO } from "../variants/string-field/string-field.vo"
import { createCheckboxFieldDTO } from "../variants/checkbox-field"
import { createUserFieldDTO } from "../variants/user-field"

export const createFieldDTO = z.discriminatedUnion("type", [
  createStringFieldDTO,
  createNumberFieldDTO,
  createReferenceFieldDTO,
  createRollupFieldDTO,
  createSelectFieldDTO,
  createRatingFieldDTO,
  createEmailFieldDTO,
  createAttachmentFieldDTO,
  createDateFieldDTO,
  createJsonFieldDTO,
  createCheckboxFieldDTO,
  createUserFieldDTO,
])

export type ICreateFieldDTO = z.infer<typeof createFieldDTO>
