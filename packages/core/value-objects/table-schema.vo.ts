import { ValueObject } from '@egodb/domain'
import * as z from 'zod'
import type { Column } from '../column'
import { createColumnSchema } from '../column'

export const createTableSchemaSchema = z.array(createColumnSchema)

export type ICreateTableSchemaSchema = z.infer<typeof createTableSchemaSchema>

export class TableSchema extends ValueObject {
  constructor(public readonly column: Column<any>) {
    super({ column })
  }
}
