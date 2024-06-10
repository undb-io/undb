import { z } from "@undb/zod"
import { referenceFieldDTO, rollupFieldDTO, updatedByFieldDTO } from "../variants"
import { autoIncrementFieldDTO } from "../variants/autoincrement-field"
import { createdAtFieldDTO } from "../variants/created-at-field"
import { createdByFieldDTO } from "../variants/created-by-field"
import { idFieldDTO } from "../variants/id-field/id-field.vo"
import { createNumberFieldDTO, numberFieldDTO } from "../variants/number-field/number-field.vo"
import { createStringFieldDTO, stringFieldDTO } from "../variants/string-field/string-field.vo"
import { updatedAtFieldDTO } from "../variants/updated-at-field/updated-at-field.vo"

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
])

export type IFieldDTO = z.infer<typeof fieldDTO>

export const inferCreateFieldDTO = z.discriminatedUnion("type", [
  createStringFieldDTO.omit({ id: true, name: true }),
  createNumberFieldDTO.omit({ id: true, name: true }),
])

export type IInferCreateFieldDTO = z.infer<typeof inferCreateFieldDTO>
