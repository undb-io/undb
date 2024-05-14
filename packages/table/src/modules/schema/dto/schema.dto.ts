import type { z } from "zod"
import { fieldDTO } from "../fields/dto/field.dto"

export const schemaDTO = fieldDTO.array()

export type ISchemaDTO = z.infer<typeof schemaDTO>
