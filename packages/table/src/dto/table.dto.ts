import { z } from 'zod'
import { schemaDTO } from '../modules/schema/dto/schema.dto'
import { viewsDTO } from '../modules/views/dto'
import { tableId } from '../table-id.vo'
import { tableName } from '../table-name.vo'

export const tableDTO = z.object({
  id: tableId,
  name: tableName,
  schema: schemaDTO,
  views: viewsDTO,
})

export type ITableDTO = z.infer<typeof tableDTO>
