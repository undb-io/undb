import { z } from "@undb/zod"
import { createFieldDTO } from "../fields/dto/create-field.dto"

export const createSchemaDTO = z.array(createFieldDTO).nonempty()

export type ICreateSchemaDTO = z.infer<typeof createSchemaDTO>
