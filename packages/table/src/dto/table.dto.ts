import { z } from "@undb/zod"
import { rlsDTO } from "../modules"
import { schemaDTO } from "../modules/schema/dto/schema.dto"
import { viewsDTO } from "../modules/views/dto"
import { tableId } from "../table-id.vo"
import { tableName } from "../table-name.vo"
import { formsDTO } from "../modules/forms/forms.vo"

export const tableDTO = z.object({
  id: tableId,
  name: tableName,
  schema: schemaDTO,
  views: viewsDTO,
  rls: rlsDTO.optional(),
  forms: formsDTO.optional(),
})

export type ITableDTO = z.infer<typeof tableDTO>
