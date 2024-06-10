import { z } from "@undb/zod"
import { createRollupFieldDTO } from "../variants"
import { createNumberFieldDTO } from "../variants/number-field/number-field.vo"
import { createReferenceFieldDTO } from "../variants/reference-field/reference-field.vo"
import { createStringFieldDTO } from "../variants/string-field/string-field.vo"

export const createFieldDTO = z.discriminatedUnion("type", [
  createStringFieldDTO,
  createNumberFieldDTO,
  createReferenceFieldDTO,
  createRollupFieldDTO,
])

export type ICreateFieldDTO = z.infer<typeof createFieldDTO>
