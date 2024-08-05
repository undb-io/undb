import { baseIdSchema } from "@undb/base"
import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import { formsDTO, rlsGroupDTO } from "../modules"
import { schemaDTO } from "../modules/schema/dto/schema.dto"
import { viewsDTO } from "../modules/views/dto"
import { tableId } from "../table-id.vo"
import { tableName } from "../table-name.vo"

export const tableDTO = z.object({
  id: tableId,
  name: tableName,
  baseId: baseIdSchema,
  spaceId: spaceIdSchema,
  schema: schemaDTO,
  views: viewsDTO,
  rls: rlsGroupDTO.optional(),
  forms: formsDTO.optional(),
})

export type ITableDTO = z.infer<typeof tableDTO>
