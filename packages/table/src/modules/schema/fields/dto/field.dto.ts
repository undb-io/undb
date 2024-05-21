import { z } from "@undb/zod"
import { numberFieldDTO, stringFieldDTO, updatedAtFieldDTO } from ".."
import { autoIncrementFieldDTO } from "../variants/autoincrement-field"
import { createdAtFieldDTO } from "../variants/created-at-field"
import { idFieldDTO } from "../variants/id-field"

export const fieldDTO = z.union([
  stringFieldDTO,
  numberFieldDTO,
  idFieldDTO,
  createdAtFieldDTO,
  autoIncrementFieldDTO,
  updatedAtFieldDTO,
])

export type IFieldDTO = z.infer<typeof fieldDTO>
