import { z } from "zod"
import { numberFieldDTO, stringFieldDTO } from ".."
import { autoIncrementFieldDTO } from "../variants/autoincrement-field"
import { createdAtFieldDTO } from "../variants/created-at-field"
import { idFieldDTO } from "../variants/id-field"

export const fieldDTO = z.union([stringFieldDTO, numberFieldDTO, idFieldDTO, createdAtFieldDTO, autoIncrementFieldDTO])

export type IFieldDTO = z.infer<typeof fieldDTO>
