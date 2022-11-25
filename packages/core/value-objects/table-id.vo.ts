import { ID } from '@egodb/domain'
import * as z from 'zod'

export const tableIdSchema = z.string().min(1)

export class TableId extends ID {
  constructor(id: string) {
    super(tableIdSchema.parse(id))
  }
}
