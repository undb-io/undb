import * as z from 'zod'
import { tableNameSchema } from '../../value-objects/table-name.vo'

export const createTableCommandInput = z.object({
  name: tableNameSchema,
})
