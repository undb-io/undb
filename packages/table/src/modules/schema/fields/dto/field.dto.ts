import { z } from "zod"
import { numberFieldDTO, stringFieldDTO } from ".."
import { createdAtFieldDTO } from "../variants/created-at-field"
import { idFieldDTO } from "../variants/id-field"

export const fieldDTO = z.union([stringFieldDTO, numberFieldDTO, idFieldDTO, createdAtFieldDTO])

export type IFieldDTO = z.infer<typeof fieldDTO>
