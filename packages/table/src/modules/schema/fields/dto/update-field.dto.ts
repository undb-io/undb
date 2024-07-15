import { z } from "@undb/zod"
import {
  updateAutoIncrementFieldDTO,
  updateCreatedByFieldDTO,
  updateDateFieldDTO,
  updateJsonFieldDTO,
  updateRatingFieldDTO,
  updateReferenceFieldDTO,
  updateRollupFieldDTO,
  updateSelectFieldDTO,
  updateUpdatedByFieldDTO,
} from "../variants"
import { updateAttachmentFieldDTO } from "../variants/attachment-field"
import { updateCheckboxFieldDTO } from "../variants/checkbox-field"
import { updateCreatedAtFieldDTO } from "../variants/created-at-field/created-at-field.vo"
import { updateEmailFieldDTO } from "../variants/email-field"
import { updateIdFieldDTO } from "../variants/id-field/id-field.vo"
import { updateNumberFieldDTO } from "../variants/number-field/number-field.vo"
import { updateStringFieldDTO } from "../variants/string-field/string-field.vo"
import { updateUpdatedAtFieldDTO } from "../variants/updated-at-field/updated-at-field.vo"
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
])

export type IUpdateFieldDTO = z.infer<typeof updateFieldDTO>
