import { z } from "zod"
import { numberFieldDTO, stringFieldDTO } from ".."

export const fieldDTO = z.union([stringFieldDTO, numberFieldDTO])

export type IFieldDTO = z.infer<typeof fieldDTO>
