import { z } from "@undb/zod"
import { createFieldDTO, createTablesFieldDTO } from "../fields/dto/create-field.dto"

export const createSchemaDTO = z
  .array(createFieldDTO)
  .nonempty()
  .refine(
    (data) => {
      const fieldIds = data.map((field) => field.id).filter((id) => !!id)
      const set = new Set(fieldIds)

      return set.size === fieldIds.length
    },
    {
      message: "Field id must be unique",
    },
  )

export type ICreateSchemaDTO = z.infer<typeof createSchemaDTO>

export const createTablesSchemaDTO = z
  .array(createTablesFieldDTO)
  .nonempty()
  .refine(
    (data) => {
      const fieldIds = data.map((field) => field.id).filter((id) => !!id)
      const set = new Set(fieldIds)

      return set.size === fieldIds.length
    },
    {
      message: "Field id must be unique",
    },
  )

export type ICreateTablesSchemaDTO = z.infer<typeof createTablesSchemaDTO>
