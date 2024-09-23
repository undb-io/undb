import { baseIdSchema } from "@undb/base"
import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import { createFormDTO } from "../modules/forms/dto/create-form.dto"
import { createSchemaDTO, createTablesSchemaDTO } from "../modules/schema/dto/create-schema.dto"
import { createViewDTO } from "../modules/views/dto/create-view.dto"
import { tableId } from "../table-id.vo"
import { tableName } from "../table-name.vo"

export const createTableDTO = z.object({
  id: tableId.optional(),
  name: tableName,
  baseId: baseIdSchema,
  spaceId: spaceIdSchema,

  schema: createSchemaDTO,

  views: createViewDTO.array().optional(),
  forms: createFormDTO.array().optional(),
})

export type ICreateTableDTO = z.infer<typeof createTableDTO>

export const createTablesDTO = createTableDTO.merge(
  z.object({
    schema: createTablesSchemaDTO,
  }),
)

export type ICreateTablesDTO = z.infer<typeof createTablesDTO>
