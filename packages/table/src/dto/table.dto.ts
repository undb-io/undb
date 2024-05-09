import { z } from 'zod'
import { schemaDTO } from '../modules/schema/dto/schema.dto'
import { tableId } from '../table-id.vo'
import { tableName } from '../table-name.vo'

export const tableDTO = z.object({
  id: tableId,
  name: tableName,
  schema: schemaDTO,
})

export type ITableDTO = z.infer<typeof tableDTO>
