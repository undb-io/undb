import { z } from "@undb/zod"
import { updateAutoIncrementFieldDTO } from "../variants"
import { updateCreatedAtFieldDTO } from "../variants/created-at-field/created-at-field.vo"
import { updateIdFieldDTO } from "../variants/id-field/id-field.vo"
import { updateNumberFieldDTO } from "../variants/number-field/number-field.vo"
import { updateStringFieldDTO } from "../variants/string-field/string-field.vo"
import { updateUpdatedAtFieldDTO } from "../variants/updated-at-field/updated-at-field.vo"

export const updateFieldDTO = z.discriminatedUnion("type", [
  updateIdFieldDTO,
  updateStringFieldDTO,
  updateNumberFieldDTO,
  updateCreatedAtFieldDTO,
  updateUpdatedAtFieldDTO,
  updateAutoIncrementFieldDTO,
])

export type IUpdateFieldDTO = z.infer<typeof updateFieldDTO>
