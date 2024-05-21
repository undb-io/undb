import { z } from "@undb/zod"
import { createNumberFieldDTO } from "../variants/number-field/number-field.vo"
import { createStringFieldDTO } from "../variants/string-field/string-field.vo"

export const createFieldDTO = z.union([createStringFieldDTO, createNumberFieldDTO])

export type ICreateFieldDTO = z.infer<typeof createFieldDTO>
