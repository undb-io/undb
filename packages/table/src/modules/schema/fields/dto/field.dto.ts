import { z } from "zod"
import { numberFieldDTO, stringFieldDTO } from ".."
import { idFieldDTO } from "../variants/id-field"

export const fieldDTO = z.union([stringFieldDTO, numberFieldDTO, idFieldDTO])

export type IFieldDTO = z.infer<typeof fieldDTO>
