import { z } from "@undb/zod"
import { createFieldDTO, createTablesFieldDTO } from "../fields/dto/create-field.dto"

export const createSchemaDTO = z.array(createFieldDTO).nonempty()

export type ICreateSchemaDTO = z.infer<typeof createSchemaDTO>

export const createTablesSchemaDTO = z.array(createTablesFieldDTO).nonempty()

export type ICreateTablesSchemaDTO = z.infer<typeof createTablesSchemaDTO>
