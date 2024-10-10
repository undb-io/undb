import { baseIdSchema, baseNameSchema } from "@undb/base"
import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import { createFormDTO } from "../modules/forms/dto/create-form.dto"
import { createRecordDTO } from "../modules/records/record/dto/create-record.dto"
import { createSchemaDTO, createTablesSchemaDTO } from "../modules/schema/dto/create-schema.dto"
import { fieldId } from "../modules/schema/fields/field-id.vo"
import { fieldName } from "../modules/schema/fields/field-name.vo"
import { createViewDTO } from "../modules/views/dto/create-view.dto"
import { tableId } from "../table-id.vo"
import { tableName } from "../table-name.vo"

export const createTableDTO = z.object({
  id: tableId.optional(),
  name: tableName,
  baseId: baseIdSchema.optional(),
  baseName: baseNameSchema.optional(),
  spaceId: spaceIdSchema,

  schema: createSchemaDTO,
  fieldsOrder: z.array(fieldName.or(fieldId)).optional(),

  views: createViewDTO.array().optional(),
  forms: createFormDTO.array().optional(),

  records: createRecordDTO.array().optional(),
})

export type ICreateTableDTO = z.infer<typeof createTableDTO>

export const createTablesDTO = createTableDTO.merge(
  z.object({
    schema: createTablesSchemaDTO,
  }),
)

export type ICreateTablesDTO = z.infer<typeof createTablesDTO>
